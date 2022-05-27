import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

const Category = () => {
  const [listings, setListings] = useState(null);
  const [lastFetchedListings, setLastFetchedListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      if (isMounted.current) {
        try {
          // get reference
          const listingsRef = collection(db, 'listings');
          // create a query
          const qry = query(
            listingsRef,
            where('type', '==', params.categoryName),
            orderBy('timestamp', 'desc'),
            limit(10)
          );
          // execute query
          const querySnap = await getDocs(qry);
          const lastVisible = querySnap.docs[querySnap.docs.length - 1];
          setLastFetchedListings(lastVisible);
          const lists = [];
          querySnap.forEach((doc) => {
            return lists.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          setListings(lists);
          setLoading(false);
        } catch (error) {
          toast.error('Could not fetch listings');
        }
      }
    };
    fetchListings();

    return () => {
      isMounted.current = false;
    };
  }, [params.categoryName]);

  // Pagination/ Load More
  const onMoreFetchedListings = async () => {
    try {
      // get reference
      const listingsRef = collection(db, 'listings');
      // create a query
      const qry = query(
        listingsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListings),
        limit(10)
      );
      // execute query
      const querySnap = await getDocs(qry);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListings(lastVisible);
      const lists = [];
      querySnap.forEach((doc) => {
        return lists.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevState) => {
        return [...prevState, ...lists];
      });
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings');
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          Places for {params.categoryName}
          {/* Places for {params.categoryName === 'rent' ? 'rent' : 'sale'} */}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListings && (
            <p className="loadMore" onClick={onMoreFetchedListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
};

export default Category;
