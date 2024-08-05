"use client";
import React, { ChangeEvent, useState } from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  IconButton,
  SelectChangeEvent,
  Typography,
  Button,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import styles from "../styles/searchpost.module.css";
import { useAuth } from "../hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

type Props = {
  children: React.ReactNode;
};

const SearchPost = ({ children }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useAuth();
  const theme = settings?.colorTheme || "light";
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const [pages, setPages] = useState([1, 2, 3, 4, 5, 6]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [currentSort, setCurrentSort] = useState(
    searchParams.get("sort") || "createdAtDesc"
  );
  const [currentSearchType, setCurrentSearchType] = useState(
    searchParams.get("type") || "post"
  );
  const sortOptions = [
    { name: "Username", value: "username" },
    { name: "Date Posted (Asc)", value: "createdAtAsc" },
    { name: "Date Posted (Desc)", value: "createdAtDesc" },
  ];
  const searchTypeOptions = [
    { name: "Post", value: "post" },
    { name: "User", value: "user" },
  ];

  const search = (
    s = searchTerm,
    currentType = currentSearchType,
    sortOp = currentSort,
    page = currentPage
  ) => {
    let filters = 0;
    let url = String(pathname);
    url += `?page=${page}`;
    {
      s != "" ? (url += `&search=${s}`) : null;
    }
    url += `&type=${currentType}`;
    url += `&sort=${sortOp}`;

    router.push(url);
  };

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: SelectChangeEvent) => {
    setCurrentSort(e.target.value);
    search(undefined, undefined, e.target.value);
  };
  const handleSearchTypeChange = (e: SelectChangeEvent) => {
    setCurrentSearchType(e.target.value);
  };

  const handlePageChange = (page: number) => {
    if (currentPage === page || page < 1) {
      return;
    } else {
      search(undefined, undefined, undefined, page);
    }
  };

  return (
    <Grid container>
      <Grid
        item
        id={styles.searchpost_box}
        sx={{ color: theme == "dark" ? "white" : "black" }}
      >
        <Grid item className={styles.searchpost_search_box}>
          <TextField
            fullWidth
            className={styles.searchpost_search_input_box}
            inputProps={{
              className: styles.searchpost_search_input,
            }}
            placeholder={
              currentSearchType == "post"
                ? "Search for posts"
                : "Search for user"
            }
            onChange={handleSearchTermChange}
          />
          <IconButton
            onClick={() => search()}
            className={styles.searchpost_search_btn}
          >
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid item className={styles.searchpost_search_type_select_box}>
          <Typography
            sx={{ whiteSpace: "nowrap", display: "inline-block", minWidth: 85 }}
          >
            Search By:
          </Typography>
          <Select
            fullWidth
            inputProps={{ className: styles.searchpost_search_type_select }}
            value={currentSearchType}
            onChange={handleSearchTypeChange}
          >
            {searchTypeOptions.map((searchType) => (
              <MenuItem key={searchType.name} value={searchType.value}>
                {searchType.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item className={styles.searchpost_search_sort_select_box}>
          <Typography
            sx={{ whiteSpace: "nowrap", display: "inline-block", minWidth: 65 }}
          >
            Sort By:
          </Typography>
          <Select
            fullWidth
            inputProps={{ className: styles.searchpost_search_sort_select }}
            value={currentSort}
            onChange={handleSortChange}
          >
            {sortOptions.map((op) => (
              <MenuItem key={op.name} value={op.value}>
                {op.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      {children}
      <Grid id={styles.searchPost_page_buttons}>
        <IconButton onClick={() => handlePageChange(currentPage - 1)}>
          <KeyboardArrowLeftIcon />
        </IconButton>
        {pages.map((num) => (
          <Button
            onClick={() => handlePageChange(num)}
            sx={{ backgroundColor: currentPage == num ? "#484747" : "unset" }}
            key={num}
          >
            {num}
          </Button>
        ))}
        <IconButton onClick={() => handlePageChange(currentPage + 1)}>
          <KeyboardArrowRightIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default SearchPost;
