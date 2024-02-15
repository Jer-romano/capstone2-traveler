import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class TravelerApi {
  // the token for interaction with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get", formData = false) {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    // const headers = formData ? 
    // { Authorization: `Bearer ${TravelerApi.token}`,
    //   "content-type": 'multipart/form-data' }
    //                       :
    //   { Authorization: `Bearer ${TravelerApi.token}`};

    const headers = { Authorization: `Bearer ${TravelerApi.token}`};

    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  static async createTrip(data) {
    let res = await this.request("trips", data, "post");
    return res.trip;
  }

  static async addImageToTrip(id, data) {
    let res = await this.request(`trips/${id}`, data, "post", true);
    return res.imageId;
  }

  /** Get all Trips in DB */

  static async getAllTrips() {
    let res = await this.request("trips");
    return res.trips;
  }

  /** Get details on a trip by id */

  static async getTrip(id) {
    let res = await this.request(`companies/${id}`);
    return res.trip;
  }

  /** Get all trips from a single user */
  static async getUserTrips(id) {
    let res = await this.request(`users/${id}/trips`)
    return res.trips;
  }


  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Save user profile page. */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }
}


export default TravelerApi;
