import React from 'react';
import TripList from '../trips/TripList';

const Feed = () => {

    return (
        <TripList includeUser={true} />
    );

};

export default Feed;