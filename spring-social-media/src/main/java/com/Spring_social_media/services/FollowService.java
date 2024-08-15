package com.Spring_social_media.services;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.Spring_social_media.models.Follow;
import com.Spring_social_media.models.Post;
import com.Spring_social_media.models.User;
import com.Spring_social_media.dtos.FollowRecommendationDto;
import com.Spring_social_media.projections.FollowersProjection;
import com.Spring_social_media.projections.FollowingProjection;
import com.Spring_social_media.projections.PostProjection;
import com.Spring_social_media.repositories.BlockRepository;
import com.Spring_social_media.repositories.FollowRepository;
import com.Spring_social_media.repositories.PostRepository;
import java.util.Optional;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class FollowService {
    
    private final FollowRepository followRepository;
    private final PostRepository postRepository;
    private final BlockRepository blockRepository;


    public FollowService(FollowRepository followRepository, PostRepository postRepository, BlockRepository blockRepository) {
        this.followRepository = followRepository;
        this.postRepository = postRepository;
        this.blockRepository = blockRepository;
    }

    public Page<FollowersProjection> getFollowers(User user, Integer page, String search) {
        String searchInput = search.equals("undefined") || search.equals("") ? "": search;

        if (page < 1) {
            page = 1;
        }

        Pageable pageable = PageRequest.of(page -1, 50);

        return followRepository.findByFollowedAndSearch(user.getId(), searchInput, pageable);
    }

    public Page<FollowingProjection> getFollowing(User user, Integer page, String search) {
        String searchInput = search.equals("undefined") || search.equals("") ? "": search;

        if (page < 1) {
            page = 1;
        }

        Pageable pageable = PageRequest.of(page -1, 50);

        return followRepository.findByFollowingAndSearch(user.getId(), searchInput, pageable);
    }

    public void follow(User following, User followed) {

        Optional<Follow> alreadyFollowed = followRepository.findByFollowingAndFollowed(following, followed);

        if (alreadyFollowed.isPresent()) {
            followRepository.delete(alreadyFollowed.get());
        } else if (followed.getSettings().getAllowFollows().equals("no")) {
            throw new RuntimeException("User does not allow follows");
        } else if (blockRepository.findByBlockingAndBlocked(followed, following).isPresent()) {
            throw new RuntimeException("This user has blocked you");
        } else {
            Follow newFollow = new Follow();
            newFollow.setFollowed(followed);
            newFollow.setFollowing(following);
            followRepository.save(newFollow);
        }
    }

    public boolean isFollowed(User following, User followed) {
        return followRepository.findByFollowingAndFollowed(following, followed).isPresent();

    }

    public List<User> getFollowedUserList(User user) {
        return followRepository.findFollowedUsersByUserId(user.getId());
    }

    public List<FollowRecommendationDto> getFollowRecommendations(boolean signedIn, User user) {
        Sort.Direction direction = Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(0, 25, Sort.by(direction, "likeCount"));
        Page<User> users = postRepository.findPopularPostUsersAll(pageable);
        Set<User> destinctUsers = new HashSet<>(users.getContent());
        List<User> userList = new ArrayList<>(destinctUsers);

        if (signedIn) {
            if (userList.contains(user)) {
                userList.remove(user);
            }
            List<User> followedUsers = followRepository.findUsersBeingFollowedBy(user);
            List<User> newList = new ArrayList<>();
            for (User u: userList) {
                boolean alreadyIn = false;
                for (User x: followedUsers) {
                    if (x.equals(u)) {
                        alreadyIn =true;
                    }
                }
                if (!alreadyIn) {
                    newList.add(u);
                }
            }
            userList = newList;
        }
        return userList.stream()
        .map(u -> new FollowRecommendationDto(u.getId(), u.getUsername(), u.getProfilePicture()))
        .collect(Collectors.toList());
    
    }

    public Follow getFollow(User following, User followed) {
        return followRepository.findByFollowingAndFollowed(following, followed).orElseThrow(() -> new RuntimeException("Follow not found"));
    }

    public void deleteFollow(Follow follow) {
        followRepository.delete(follow);
    }
        
    
}
