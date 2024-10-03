import { InputAdornment, TextField } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const SearchBox = () => {
  return (
    <>
      <div className="searchBox">
        <TextField
          type="text"
          size="small"
          placeholder="search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
    </>
  );
};

export default SearchBox;
