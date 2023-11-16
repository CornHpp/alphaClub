import React, { useState } from "react";
import { Input, Button } from "antd-mobile";
import { SearchOutline } from "antd-mobile-icons";
import styles from "./index.module.scss";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (val: string) => void;
  className?: string;
  [x: string]: any;
}

const SearchInput: React.FC<SearchInputProps> = (props: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState("");
  // 去搜索
  const onSearch = (val?: string) => {
    props.onSearch && props.onSearch(val || searchValue);
  };

  // 清空
  const onClear = () => {
    setSearchValue("");
    onSearch("");
  };

  // 输入值发生变化时触发搜索
  const onSearchChange = (val: string) => {
    setSearchValue(val);
    // onSearch(val)
  };

  return (
    <div className={`${styles.searchInputWrap} ${props.className}`}>
      <Input
        className={styles.searchInput}
        clearable
        value={searchValue}
        onChange={onSearchChange}
        onClear={onClear}
        onEnterPress={() => onSearch()}
        {...props}
        placeholder={props?.placeholder || "Search"}
      />
    </div>
  );
};

export default SearchInput;
