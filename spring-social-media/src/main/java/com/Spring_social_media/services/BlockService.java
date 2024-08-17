package com.Spring_social_media.services;

import org.springframework.stereotype.Service;

import com.Spring_social_media.repositories.BlockRepository;
import com.Spring_social_media.models.Block;
import com.Spring_social_media.models.User;
import com.Spring_social_media.models.Follow;

@Service
public class BlockService {

    private final BlockRepository blockRepository;
    private final FollowService followService;
    
    public BlockService(BlockRepository blockRepository, FollowService followService) {
        this.blockRepository = blockRepository;
        this.followService = followService;
    }

    // Blocks user and removes follow if there is one
    public void blockUser(User blocking, User blocked) {
        if (blockRepository.findByBlockingAndBlocked(blocking, blocked).isPresent()) {
            return;
        }
        
        try {
            Follow follow = followService.getFollow(blocked, blocking);
            followService.deleteFollow(follow);
        } catch(Exception e) {}

        Block newBlock = new Block();
        newBlock.setBlocking(blocking);
        newBlock.setBlocked(blocked);
        blockRepository.save(newBlock);
    }

    // Checks if user is blocked
    public boolean isBlocked(User blocking, User blocked) {
        return blockRepository.findByBlockingAndBlocked(blocking, blocked).isPresent();
    }
}
