import "./SearchPage.scss";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import searchApi from "../../api/searchApi";

import CollectionsSearchResult from "./CollectionSearchResult/CollectionSearchResult";
import RecipesSearchResult from "./RecipeSearchResult/RecipeSearchResult";
import Pagination from "../Pagination/Pagination";

function SearchPage() {
  const params = useParams();
  const [recipesSearchResult, setRecipesSearchResult] = useState([]);
  const [collectionsSearchResult, setCollectionsSearchResult] = useState([]);
  const [isInteractionCollection, setIsInteractionCollection] = useState(false);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const limitItemInPage = 12;

  const receiveValuePagination1 = (curPage) => {
    setCurrentPage1(curPage);
  };
  const receiveValuePagination2 = (curPage) => {
    setCurrentPage2(curPage);
  };

  useEffect(() => {
    searchApi
      .searchRecipes(params.keyword)
      .then((res) => {
        setRecipesSearchResult([...res.data]);
      })
      .catch((err) => console.log(err));

    searchApi
      .searchCollections(params.keyword)
      .then((res) => {
        setCollectionsSearchResult([...res.data]);
      })
      .catch((err) => console.log(err));
  }, [params.keyword, isInteractionCollection]);

  return (
    <>
      {!recipesSearchResult[0] && !collectionsSearchResult[0] ? (
        <div className="container">
          <div className="row">
            <h4 className="mt-4">
              Không tìm thấy kết quả phù hợp, vui lòng thử với từ khóa khác.
            </h4>
          </div>
        </div>
      ) : (
        <>
          <div className="recipes-search-result-container">
            <div className="container">
              {!recipesSearchResult[0] ? (
                <h4>Không tìm thấy công thức phù hợp với từ khóa</h4>
              ) : (
                <div className="row">
                  <h4>Công thức tìm được</h4>
                  {recipesSearchResult
                    .slice(
                      (currentPage1 - 1) * limitItemInPage,
                      currentPage1 * limitItemInPage
                    )
                    .map((recipe) => {
                      return (
                        <div className="col-2" key={recipe.id}>
                          <RecipesSearchResult recipe={recipe} />
                        </div>
                      );
                    })}
                </div>
              )}
              {recipesSearchResult[0] && (
                <Pagination
                  itemArray={recipesSearchResult}
                  limitItemInPage={limitItemInPage}
                  passValuePagination={receiveValuePagination1}
                />
              )}
            </div>
          </div>

          <div className="collections-search-result-container">
            <div className="container">
              {!collectionsSearchResult[0] ? (
                <h4>Không tìm thấy bộ sưu tập phù hợp với từ khóa</h4>
              ) : (
                <div className="row">
                  <h4>Bộ sưu tập tìm được</h4>
                  {collectionsSearchResult
                    .slice(
                      (currentPage2 - 1) * limitItemInPage,
                      currentPage2 * limitItemInPage
                    )
                    .map((collection) => {
                      return (
                        <div className="col-2" key={collection.id}>
                          <CollectionsSearchResult
                            collection={collection}
                            setIsInteractionCollection={
                              setIsInteractionCollection
                            }
                            isInteractionCollection={isInteractionCollection}
                          />
                        </div>
                      );
                    })}
                </div>
              )}
              {collectionsSearchResult[0] && (
                <Pagination
                  itemArray={collectionsSearchResult}
                  limitItemInPage={limitItemInPage}
                  passValuePagination={receiveValuePagination2}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SearchPage;
