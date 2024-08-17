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
  pageCount: number;
  showSearchBar?: true | false;
};

const SearchPost = ({ children, pageCount, showSearchBar }: Props) => {
  const router = useRouter();
  const pathname = usePathname(); // Gets pathname
  const { settings } = useAuth();
  const theme = settings?.colorTheme || "light"; // User's selected theme
  const searchParams = useSearchParams(); // Url search params
  const currentPage = parseInt(searchParams.get("page") || "1"); // Current page being viewed

  // Page button numbers
  const pages = () => {
    const pagesArray: number[] = [];
    currentPage - 2 > 1 ? pagesArray.push(currentPage - 2) : null;
    currentPage - 1 > 1 ? pagesArray.push(currentPage - 1) : null;
    pagesArray.push(currentPage);
    currentPage + 1 < pageCount ? pagesArray.push(currentPage + 1) : null;
    currentPage + 2 < pageCount ? pagesArray.push(currentPage + 2) : null;

    return pagesArray;
  };
  // Term being search
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  // Current sort option
  const [currentSort, setCurrentSort] = useState(
    searchParams.get("sort") || "createdAtDesc"
  );
  // Current search type
  const [currentSearchType, setCurrentSearchType] = useState(
    searchParams.get("type") || "post"
  );
  // Sort option list
  const sortOptions = [
    { name: "Username", value: "username" },
    { name: "Date Posted (Asc)", value: "createdAtAsc" },
    { name: "Date Posted (Desc)", value: "createdAtDesc" },
  ];
  // Search type option list
  const searchTypeOptions = [
    { name: "Post", value: "post" },
    { name: "User", value: "user" },
  ];

  // Applies selected search options
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

  // Handles changes to the search term
  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handles changes to the sort option
  const handleSortChange = (e: SelectChangeEvent) => {
    setCurrentSort(e.target.value);
    search(undefined, undefined, e.target.value);
  };

  // Handles changes to the search type
  const handleSearchTypeChange = (e: SelectChangeEvent) => {
    setCurrentSearchType(e.target.value);
  };

  // Handles changes to the page
  const handlePageChange = (page: number) => {
    if (currentPage === page || page < 1 || page > pageCount) {
      return;
    } else {
      search(undefined, undefined, undefined, page);
    }
  };

  return (
    <Grid container>
      {showSearchBar != false ? (
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
              sx={{ backgroundColor: theme == "dark" ? "unset" : "white" }}
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
              sx={{
                whiteSpace: "nowrap",
                display: "inline-block",
                minWidth: 85,
              }}
            >
              Search By:
            </Typography>
            <Select
              fullWidth
              inputProps={{ className: styles.searchpost_search_type_select }}
              value={currentSearchType}
              onChange={handleSearchTypeChange}
              sx={{ backgroundColor: theme == "dark" ? "unset" : "white" }}
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
              sx={{
                whiteSpace: "nowrap",
                display: "inline-block",
                minWidth: 65,
              }}
            >
              Sort By:
            </Typography>
            <Select
              fullWidth
              inputProps={{ className: styles.searchpost_search_sort_select }}
              value={currentSort}
              onChange={handleSortChange}
              sx={{ backgroundColor: theme == "dark" ? "unset" : "white" }}
            >
              {sortOptions.map((op) => (
                <MenuItem key={op.name} value={op.value}>
                  {op.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      ) : null}
      {children}
      {pageCount > 1 ? (
        <Grid id={styles.searchPost_page_buttons}>
          <IconButton onClick={() => handlePageChange(currentPage - 1)}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          {currentPage != 1 ? (
            <Button
              onClick={() => handlePageChange(1)}
              sx={{
                backgroundColor: currentPage == 1 ? "#484747" : "unset",
              }}
            >
              1
            </Button>
          ) : null}
          {pageCount > 4 && currentPage > 1 + 3 ? <Button>...</Button> : null}
          {pages().map((num) => (
            <Button
              onClick={() => handlePageChange(num)}
              sx={{ backgroundColor: currentPage == num ? "#484747" : "unset" }}
              key={num}
            >
              {num}
            </Button>
          ))}
          {pageCount > 4 && currentPage < pageCount - 3 ? (
            <Button>...</Button>
          ) : null}
          {currentPage != pageCount && pageCount != 0 ? (
            <Button
              onClick={() => handlePageChange(pageCount)}
              sx={{
                backgroundColor: currentPage == pageCount ? "#484747" : "unset",
              }}
            >
              {pageCount}
            </Button>
          ) : null}
          <IconButton onClick={() => handlePageChange(currentPage + 1)}>
            <KeyboardArrowRightIcon />
          </IconButton>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default SearchPost;
