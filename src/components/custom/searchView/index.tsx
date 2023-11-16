import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";
import { SearchBar, Checkbox } from "antd-mobile";
import { Empty } from "antd-mobile";

import { searchUserByUserName } from "@/service/space";
import Button from "@/components/ui/button";
let time: NodeJS.Timeout | null = null;
const res: Array<UserInfoType> = [];

type SearchViewType = {
  selectedPeople: (res: any) => void;
  hideSearchView: () => void;
};

const SearchView: React.FC<SearchViewType> = (props) => {
  const { selectedPeople, hideSearchView } = props;
  const [value, setValue] = useState<string>("");
  const [searchList, setSearchList] = useState<UserInfoType[]>([]);
  const [showEmpty, setShowEmpty] = useState<boolean>(false);

  const clickSeach = (value: string) => {
    setValue(value);
    if (time) {
      clearTimeout(time);
    }
    time = setTimeout(() => {
      searchUserByUserName(value).then((res) => {
        console.log(res);
        const { pageList } = res.result;
        console.log(pageList);
        setSearchList(pageList);
      });
    }, 1000);
  };

  const clickCheckBox = useCallback(
    (state: boolean, item: UserInfoType) => {
      console.log(value, item);
      if (state) {
        res.push(item);
      } else {
        const index = res.findIndex(
          (i: UserInfoType) => i.twitterUid === item.twitterUid
        );
        res.splice(index, 1);
      }
    },
    [value]
  );
  return (
    <div className={styles.container}>
      <div className={styles.blackBackground} onClick={hideSearchView}></div>
      <div className={styles.searchBoxList}>
        <SearchBar
          placeholder="请输入内容"
          className={styles.searchBar}
          onSearch={clickSeach}
          value={value}
          onChange={clickSeach}
          onClear={() => {
            setShowEmpty(false);
            setSearchList([]);
          }}
        />
        <div className={styles.searchList}>
          {searchList &&
            searchList.map((item, index) => {
              return (
                <div key={index + "a"} className={styles.searchItem}>
                  <div>{item.twitterName}</div>
                  <Checkbox
                    onChange={(value) => {
                      clickCheckBox(value, item);
                    }}
                  ></Checkbox>
                </div>
              );
            })}
          {showEmpty && <Empty description="no data found" />}
        </div>
        <Button
          height="2.5rem"
          onClick={() => {
            selectedPeople(res);
          }}
        >
          Comfirm
        </Button>
      </div>
    </div>
  );
};

export default SearchView;
