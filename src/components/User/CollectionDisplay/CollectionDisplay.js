import { useEffect, useState } from "react";
import "./CollectionDisplay.scss";
import { getToken } from "../../../features/sessionStorage";
import { useParams, Link, useLocation } from "react-router-dom";
import recipeApi from "../../../api/recipeApi";
import collection from "../../../api/collection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faClock,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import Pagination from "../../Pagination/Pagination";
import Loading from "../../Loading/Loading";

function CollectionDisplay() {
  const [recipes, setRecipes] = useState([]);
  const [isReRender, setIsReRender] = useState(false);
  const [idRecipeDelete, setIdRecipeDelete] = useState();
  const token = getToken();
  const { collectionId } = useParams();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const limitItemInPage = 8;

  const receiveValuePagination = (curPage) => {
    setCurrentPage(curPage);
  };

  const handleDeleteRecipeCollection = (e, idDelete) => {
    e.preventDefault();
    setIdRecipeDelete(idDelete);
  };

  const cancelDeleteRecipeCollection = () => {
    setIdRecipeDelete(0);
  };

  const confirmDeleteRecipeCollection = () => {
    async function deleteRecipe() {
      setIsLoading(true);
      collection
        .deleteRecipeInCollection(token, collectionId, idRecipeDelete)
        .then((res) => {
          if (res.data === "Success") {
            setIdRecipeDelete(0);
            setIsReRender((prevState) => !prevState);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
    deleteRecipe();
  };

  useEffect(() => {
    async function getRecipes() {
      await recipeApi
        .getRecipeInCollection(collectionId)
        .then((res) => {
          setRecipes([...res.data.data]);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("F: ", err);
          setIsLoading(false);
        });
    }
    getRecipes();
  }, [isReRender]);
  return (
    <>
      {isLoading && <Loading />}
      <div className="collection-display-container">
        <div className="container">
          <h3 className="collection-display-title">
            {location.state.collectionName}
          </h3>
          {!recipes[0] ? (
            <h4>Chưa có công thức nào trong bộ sưu tập</h4>
          ) : (
            <div className="row">
              {recipes
                .slice(
                  (currentPage - 1) * limitItemInPage,
                  currentPage * limitItemInPage
                )
                .map((recipe) => {
                  return (
                    <div className="col-xxl-3 col-xl-4 col-lg-6 col-12" key={recipe.id}>
                      <div className="collection-recipe-container">
                        <Link
                          to={`/recipe/${recipe.id}`}
                          className="collection-recipe-wrapper"
                        >
                          <span
                            className="collection-recipe-delete-icon"
                            onClick={(e) =>
                              handleDeleteRecipeCollection(e, recipe.id)
                            }
                          >
                            <FontAwesomeIcon icon={faCircleXmark} />
                          </span>
                          <div className="collection-recipe-image-wrapper">
                            <div className="image-overlay"></div>
                            <img
                              src={recipe.main_image_url}
                              alt={recipe.title}
                              className="collection-recipe-image"
                            />
                          </div>
                          <div className="collection-recipe-info">
                            <h5 className="collection-recipte-title">
                              {recipe.title}
                            </h5>
                            <div className="collection-recipe-detail">
                              <div className="collection-recipe-detail-number">
                                <span>
                                  <FontAwesomeIcon icon={faClock} />
                                  {` ${recipe.cooking_time}`} phút
                                </span>
                                <span>
                                  <FontAwesomeIcon icon={faEye} />
                                  {` ${recipe.total_views}`}
                                </span>
                              </div>
                              <p>
                                Khẩu phần ăn: {recipe.amount_of_people} người
                              </p>
                            </div>
                          </div>
                        </Link>
                        <Link
                          to={`/user-page/${recipe.user_name}`}
                          className="collection-recipe-owner"
                        >
                          <span>Người tạo:</span> {recipe.user_name}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              <div
                className={`delete-recipe-collection-confirm-notice ${
                  idRecipeDelete > 0 ? "is-display" : ""
                }`}
              >
                <p>
                  Bạn có chắc chắn muốn xóa công thức này khỏi bộ sưu tập không
                  ?
                </p>
                <div className="delete-recipe-collection-button-action">
                  <button
                    className="btn btn-light"
                    onClick={cancelDeleteRecipeCollection}
                  >
                    Không
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={confirmDeleteRecipeCollection}
                  >
                    Có
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {recipes[0] && (
        <Pagination
          itemArray={recipes}
          limitItemInPage={limitItemInPage}
          passValuePagination={receiveValuePagination}
          currentPagePass={currentPage}
        />
      )}
    </>
  );
}

export default CollectionDisplay;
