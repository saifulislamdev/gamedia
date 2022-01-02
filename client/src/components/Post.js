import React from 'react';
import { Link } from 'react-router-dom';

function Post({ content, createdAt, id }) {
  return (
    <div className="col-10 col-md-8 col-lg-7">
      <div className="col-md-4">
            <div className="card">
            <img src="https://cdn.collider.com/wp-content/uploads/2020/08/call-of-duty-black-ops-cold-war-poster.jpg" className="card-img-top" alt="..."/>
            <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Post;