import React, { useEffect, useState } from "react";
import { Box, List } from "@mui/material";
import { Menu as MenuService } from "../../services/menu";
import { ItemCard } from "../Item/item-card"; // Adjust the import path
import InfiniteScroll from "react-infinite-scroll-component";
import { TItem } from "../Item/item";

const ITEMS_PER_PAGE = 10;

export const ListMenu = () => {
  const [menuItems, setMenuItems] = useState<TItem[]>([]);
  const [displayedItems, setDisplayedItems] = useState<TItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchData = async () => {
    try {
      const response = await MenuService.getAllItems();
      setMenuItems(response.data);
      setDisplayedItems(response.data.slice(0, ITEMS_PER_PAGE));
      setHasMore(response.data.length > ITEMS_PER_PAGE);
    } catch (err) {
      console.error(err);
      setHasMore(false);
    }
  };

  const loadMoreItems = () => {
    const nextIndex = currentIndex + ITEMS_PER_PAGE;
    setDisplayedItems(menuItems.slice(0, nextIndex));
    setCurrentIndex(nextIndex);
    if (nextIndex >= menuItems.length) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box
      style={{
        maxHeight: "900px",
        overflow: "auto",
        scrollbarColor: "#333",
      }}
    >
      <InfiniteScroll
        dataLength={displayedItems.length}
        next={loadMoreItems}
        hasMore={hasMore}
        loader={<></>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <List sx={{ width: "100%", maxWidth: 400 }}>
          {displayedItems.map((item) => (
            <ItemCard key={item.id} {...item} />
          ))}
        </List>
      </InfiniteScroll>
    </Box>
  );
};
