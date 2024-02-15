import React from "react";
import { Link } from "react-router-dom";

import "./TripPreviewCard.css";

/** Show limited information about a trip
 *
 * Is rendered by TripList to show a "card" for each trip.
 *
 * TripList -> TripPreviewCard
 */

function TripPreviewCard({id, title, tripImage, username, profileImage }) {
  console.debug("TripPreviewCard", id);

  return (
      <Link className="TripPreviewCard card" to={`/trips/${id}`}>
        <div className="card-body">
          <h4 className="card-title">
            {profileImage && <img src={profileImage}
                             alt={"A picture of the user"}
                             className="float-left ml-5" />}
            {title}
          </h4>
          <h2>
            {username && `@${username}`}
            {<img src={tripImage}
                             alt={"A picture of the trip"}
                             className="float-right ml-5" />}
          </h2>
        </div>
      </Link>
  );
}

export default TripPreviewCard;
