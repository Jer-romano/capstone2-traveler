import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Alert from "../common/Alert";
import UserContext from "../auth/UserContext";
import TravelerApi from "../api/api";

/** New Trip form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 *
 * Routes -> NewTripForm -> Alert
 * Routed as /trips
 */

function NewTripForm() {
  const history = useHistory();
  const { currentUser } = useContext(UserContext);
  const [tripData, setTripData] = useState({
    title: "",
    userId: currentUser.id
  });
  const [imageData, setImageData] = useState({
    file: "",
    caption: "",
    tag1: "",
    tag2: "",
    tag3: ""
  });
  const [formErrors, setFormErrors] = useState([]);

  console.debug(
      "NewTripForm",
      "tripData=", tripData,
      "imageData=", imageData,
      "formErrors=", formErrors,
  );

  /** Handle form submit:
   *
   * Calls login func prop and, if successful, redirect to /companies.
   */

  async function handleSubmit(evt) {
    evt.preventDefault();

    const formData = new FormData();
    formData.append('file', imageData.file);
    formData.append('caption', imageData.caption);
    try {
        let resp = await TravelerApi.createTrip(tripData);
        let tripId = resp.id;

        await TravelerApi.addImageToTrip(tripId, formData);

    } catch(error) {
        console.error("Error submitting new trip:", error);
    }
    history.push("/");
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setTripData(data => ({ ...data, [name]: value }));
  }

    /** Update form data field */
    function handleFileChange(evt) {
        let fileObj = evt.target.files[0]
        setImageData(data => ({ ...data, file: fileObj}));
    }

    function handleImageChange(evt) {
        const { name, value } = evt.target;
        setImageData(data => ({ ...data, [name]: value }));
    }

  return (
      <div className="NewTripForm">
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
          <h2 className="mb-3">Create a New Trip</h2>
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                  <label htmlFor="title">Title of Trip</label>
                  <input
                      name="title"
                      className="form-control"
                      value={tripData.title}
                      onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>First Image</label>
                  <input
                      type="file"
                      accept="image/png image/jpeg"
                      name="firstImage"
                      className="form-control"
                      value={""}
                      onChange={handleFileChange}
                  />
                  <p>{imageData.file.name}</p>
                </div>

                <div className="form-group">
                  <label>Image Caption</label>
                  <input
                      name="caption"
                      className="form-control"
                      value={imageData.caption}
                      onChange={handleImageChange}
                  />
                </div>

                {formErrors.length
                    ? <Alert type="danger" messages={formErrors} />
                    : null
                }

                <button
                    type="submit"
                    className="btn btn-primary float-right"
                    onSubmit={handleSubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}

export default NewTripForm;