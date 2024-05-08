import ReviewList from "./ReviewList";
import { useEffect, useState } from "react";
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from "../api.js";
import ReviewForm from "./ReviewForm.js";
import "./App.css";

const LIMIT = 6;

function App() {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState("createdAt");
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const handleNewestClick = () => setOrder("createdAt");
  const handleBestClick = () => setOrder("rating");

  const handleDelete = async (id) => {
    const result = await deleteReview(id);
    if (!result) return;

    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleLoad = async (options) => {
    let result;
    try {
      setIsLoading(true);
      setLoadingError(null);
      result = await getReviews(options);
    } catch (error) {
      setLoadingError(error);
      console.log(error);
      return;
    } finally {
      setIsLoading(false);
    }
    const { reviews, paging } = result;

    if (options.offset === 0) {
      setItems(reviews);
    } else {
      setItems((prevItems) => [...prevItems, ...reviews]);
    }
    setOffset(options.offset + reviews.length);
    setHasNext(paging.hasNext);
  };

  const handleLoadMore = () => {
    handleLoad({ order, offset, limit: LIMIT });
  };

  const handleCreateSuccess = (review) => {
    setItems((prevItems) => [review, ...prevItems]);
  };

  const handleUpdateSuccess = (review) => {
    setItems((prevItems) => {
      const splitIdx = prevItems.findIndex((items) => items.id === review.id);
      return [
        ...prevItems.splice(0, splitIdx),
        review,
        ...prevItems.slice(splitIdx + 1),
      ];
    });
  };

  useEffect(() => {
    handleLoad({ order, offset: 0, limit: LIMIT });
  }, [order]);

  return (
    <main>
      <ReviewForm
        onSubmit={createReview}
        onSubmitSuccess={handleCreateSuccess}
      />
      <div>
        <button
          className={
            "newestBtn" + (order === "createdAt" ? " selectedBtn" : "")
          }
          onClick={handleNewestClick}
        >
          최신순
        </button>
        <button
          className={"bestBtn" + (order === "rating" ? " selectedBtn" : "")}
          onClick={handleBestClick}
        >
          베스트순
        </button>
      </div>
      <div className="ReviewContainer">
        <ReviewList
          items={items}
          onDelete={handleDelete}
          onUpdate={updateReview}
          onUpdateSuccess={handleUpdateSuccess}
        />
        {hasNext && (
          <button
            className="moreBtn"
            disabled={isLoading}
            onClick={handleLoadMore}
          >
            더 보기
          </button>
        )}
      </div>
      {loadingError?.message && <span>{loadingError.message}</span>}
    </main>
  );
}

export default App;
