import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GlobalStyles from "./components/GlobalStyles";
import Auth from "./components/Authentication";
import PublicRoute from "./features/PublicRoute";
import PrivateRoute from "./features/PrivateRoute";
import AdminRoute from "./features/AdminRoute";
import RegisterForm from "./components/Authentication/RegisterForm";
import ActiveEmail from "./components/Authentication/ActiveEmail";
import LoginForm from "./components/Authentication/LoginForm";
import Verify from "./components/Authentication/VerifyEmail";
import SendResetPassword from "./components/Authentication/SendResetPass";
import ResetPassword from "./components/Authentication/ResetPassword";
import BasePage from "./components/BasePage";
import Home from "./components/HomePage";
import User from "./components/User/User";
import UserInfo from "./components/UserInfo/UserInfo";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import Collection from "./components/User/Collection/Collection";
import CollectionDisplay from "./components/User/CollectionDisplay/CollectionDisplay";
import MyRecipe from "./components/User/MyRecipe/MyRecipe";
import CollectionSave from "./components/User/CollectionSave/CollectionSave";
import SearchPage from "./components/SearchPage/SearchPage";
import CollectionSaveDisplay from "./components/CollectionSaveDisplay/CollectionSaveDisplay";
import UserPage from "./components/UserPage/UserPage";

import Admin from "./components/Admin";
import Main from "./components/Admin/Main";
import Recipe from "./components/Admin/Recipe";

import {
  getToken,
  setUser,
  removeUserSession,
} from "./features/sessionStorage";
import userApi from "./api/userApi";
import RepiceInfo from "./components/Recipe/RecipeInfo";
import AddRepice from "./components/Recipe/AddRecipe";
import UpdateRecipe from "./components/Recipe/UpdateRecipe";

import RecipePending from "./components/User/RecipePending/RecipePending";
import RecipeReject from "./components/User/RecipeReject/RecipeReject";
import MyComment from "./components/User/MyComment/MyComment";
import FilterRecipePage from "./../src/components/HomePage/FilterRecipePage/FilterRecipePage";
import AdvanceSearchPage from "./components/AdvanceSearchPage/AdvanceSearchPage";
import NotFound from "./components/NotFound";
import ReportComment from "./components/Admin/ReportComment";
import ReportUser from "./components/Admin/ReportUser";
import ReportRecipe from "./components/Admin/ReportRecipe";
import Profile from "./components/Admin/Profile";

function App() {
  const [authLoading, setAutoLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    userApi
      .userInfo(token)
      .then((response) => {
        const userInfo = response?.data?.user;
        if (response?.data?.messageCode !== 1 || !userInfo) throw { response };
        setAutoLoading(false);
        setUser(userInfo);
      })
      .catch((err) => {
        removeUserSession();
        setAutoLoading(false);
      });
  }, []);

  return (
    <GlobalStyles>
      <React.StrictMode>
        <Router>
          <Routes>
            {/* Có thể truy cập mà không cần đăng nhập */}
            <Route path="" element={<BasePage />}>
              <Route index element={<Home />} />
              <Route path="user-page/:user_name" element={<UserPage />} />
              <Route path="search/:keyword" element={<SearchPage />}></Route>
              <Route
                path="collection/:collectionId"
                element={<CollectionSaveDisplay />}
              ></Route>
              <Route path="recipe/:recipeId" element={<RepiceInfo />} />
              <Route
                path="/filter-recipe/:idFilter"
                element={<FilterRecipePage />}
              />
              <Route path="/advance-search" element={<AdvanceSearchPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* Có thể truy cập mà không cần đăng nhập, không thể truy cập khi đăng nhập*/}
            <Route path="" element={<PublicRoute />}>
              <Route path="" element={<Auth />}>
                <Route path="/login" element={<LoginForm />} />
                <Route exact path="/register" element={<RegisterForm />} />
                <Route
                  exact
                  path="/sendResetPassword"
                  element={<SendResetPassword />}
                />
                <Route
                  exact
                  path="/rspassword"
                  element={<ResetPassword />}
                ></Route>
              </Route>
            </Route>
            {/* Có thể truy cập khi đăng nhập  */}
            <Route path="" element={<PrivateRoute />}>
              <Route path="" element={<BasePage />}>
                <Route path="" element={<Home />}>
                  <Route path="/activeEmail" element={<ActiveEmail />} />
                </Route>
                <Route path="/user" element={<User />}>
                  <Route index element={<Navigate to="user-info" />} />
                  <Route path="user-info" element={<UserInfo />}></Route>
                  <Route
                    path="change-password"
                    element={<ChangePassword />}
                  ></Route>
                  <Route path="collection" element={<Collection />}></Route>
                  <Route
                    path="collection/:collectionId"
                    element={<CollectionDisplay />}
                  />
                  <Route path="my-recipe" element={<MyRecipe />}></Route>
                  <Route
                    path="collection-save"
                    element={<CollectionSave />}
                  ></Route>
                  <Route path="recipe-pending" element={<RecipePending />} />
                  <Route path="recipe-reject" element={<RecipeReject />} />
                  <Route path="my-comment" element={<MyComment />} />
                </Route>
                <Route path="/create-recipe" element={<AddRepice />} />
                <Route path="/update-recipe" element={<UpdateRecipe />}>
                  <Route path=":recipeId" element={<RepiceInfo />} />
                </Route>
              </Route>
            </Route>
            <Route path="/socook" element={<AdminRoute />}>
              <Route exact path="admin" element={<Admin />}>
                <Route index element={<Main />} />
                <Route path="recipe" element={<Recipe />} />
                <Route path="reportUser" element={<ReportUser />} />
                <Route path="reportComment" element={<ReportComment />} />
                <Route path="reportRecipe" element={<ReportRecipe />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>
            {/* Các định tuyến khác  */}
            <Route path="/verify" element={<Auth />}>
              <Route index element={<Verify />} />
            </Route>
          </Routes>
        </Router>
      </React.StrictMode>
    </GlobalStyles>
  );
}

export default App;
