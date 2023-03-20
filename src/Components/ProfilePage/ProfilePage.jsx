import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../Shared/js/user-context";
import Error from "../ErrorPage/ErrorPage";
import { Rings } from "react-loader-spinner";
import Profile from "../../Shared/images/profile.svg";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { patchBackend, postBackend } from "../../Utilities/apiCalls";
import Swal from "sweetalert2";
import MoviesWatched from "../Render/MoviesWatched";
function ProfilePage() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [profile, setProfile] = useState({});
  const [moviesWatched, setMoviesWatched] = useState([]);

  const {
    state: { user },
  } = useUser();
  const MoviesWatchedFunction = () => {
    return postBackend({
      url: "watchedList/watchedListSearch",
      data: {
        User_ID: user.User_ID,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        setMoviesWatched(res);
      });
  };
  const fetchUser = () => {
    return postBackend({
      url: "userprofile/get",
      data: {
        User_ID: user.User_ID,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        setProfile(res[0]);
      })
      .catch(() => {
        Swal.fire({
          title: "Error",
          text: `Some error occurred in fetching user`,
          icon: "error",
          confirmButtonText: "Dismiss",
        });
      });
  };

  useEffect(() => {
    Promise.all([fetchUser(), MoviesWatchedFunction()]).then(() => {
      setIsLoaded(true);
    });
  }, []);
  if (error) {
    return <Error error={error.status_message} />;
  } else if (!isLoaded) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Rings color="#0d6efd" height={100} width={100} />
      </div>
    );
  } else
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-5">
            <div className="card my-4">
              <div className="card-body">
                <p className="card-title display-6 gray text-center">Profile</p>
                <hr />
                <div className="img mx-auto my-3">
                  <img src={Profile} className="" alt="pic" />
                </div>
                <Formik
                  initialValues={{
                    email: profile.Email,
                    firstname: profile.First_Name,
                    lastname: profile.Last_Name,
                    userId: profile.User_ID,
                    password: "",
                  }}
                  onSubmit={(values) => {
                    let data = {
                      User_ID: user.User_ID,
                      First_Name: values.firstname,
                      Last_Name: values.lastname,
                      Email: values.email,
                    };
                    if (values.password) {
                      data["Password"] = values.password;
                    }
                    patchBackend({
                      url: "userprofile/put",
                      data: data,
                    }).then(() => {
                      fetchUser.then(() => {
                        Swal.fire({
                          confirmButtonColor: "#e31c5f",
                          title: "Success",
                          text: `Saved Changes`,
                          icon: "success",
                          confirmButtonText: "Dismiss",
                        });
                      });
                    });
                  }}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <div className="form-floating mb-3">
                        <Field
                          readOnly
                          className="form-control"
                          id="userId"
                          name="userId"
                          placeholder="example@userId.com"
                        />
                        <label htmlFor="userId">User ID</label>
                        <div className="error">
                          <ErrorMessage name="userId" />
                        </div>
                      </div>
                      <div className="form-floating mb-3">
                        <Field
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="example@email.com"
                        />
                        <label htmlFor="email">Email</label>
                        <div className="error">
                          <ErrorMessage name="email" />
                        </div>
                      </div>
                      <div className="form-floating mb-3">
                        <Field
                          className="form-control"
                          id="firstname"
                          name="firstname"
                          placeholder="example@firstname.com"
                        />
                        <label htmlFor="firstname">First Name</label>
                        <div className="error">
                          <ErrorMessage name="firstname" />
                        </div>
                      </div>
                      <div className="form-floating mb-3">
                        <Field
                          className="form-control"
                          id="lastname"
                          name="lastname"
                          placeholder="example@lastname.com"
                        />
                        <label htmlFor="lastname">Last Name</label>
                        <div className="error">
                          <ErrorMessage name="lastname" />
                        </div>
                      </div>
                      <div className="form-floating mb-3">
                        <Field
                          className="form-control"
                          id="password"
                          name="password"
                          placeholder="Enter new password"
                        />
                        <label htmlFor="password">New Password</label>
                        <div className="error">
                          <ErrorMessage name="password" />
                        </div>
                      </div>
                      <div className="d-grid gap-2">
                        <button type="submit" className="button button1 mb-3">
                          <i className="fa fa-user-plus"></i> Save Changes
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="card-footer text-muted text-center link">
                Change recommendations? <Link to="/genres">Edit Genres</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default ProfilePage;
