import {listings, getListById} from "@/api/listings";
import { getBookings } from "@/api/bookings";

export const getmyList = async (params) => {
  // get all listings, if cannot get then, print a message
  const listingsResRaw = await listings(params);
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  if (listingsResRaw.listings.length === 0) {
    console.log("length 0")
    return [];
  }
  const listingsRes = listingsResRaw.listings;
  const listingdetail = [];
  for (let i = 0; i < listingsRes.length; i++) {
    const listDetail = await getListById(listingsRes[i].id);
    listingdetail[i] = {
      ...listingsRes[i],
      ...listDetail.listing
    }
  }

  // sort by name
  listingdetail.sort(compareNames);
  if (token) {
    const bookingRes = await getBookings();
    if (bookingRes.bookings) {
      const bookings = bookingRes.bookings;
      const sortByBooking = listingdetail.sort(compareBooking(bookings, email));
      return sortByBooking;
    }
  }
  return listingdetail;
};

// compare function for sorting alphabetically
const compareNames = (a, b) => {
  return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
};

// compare function for sorting booking
const isMyBooking = (listing, bookings, email) => {
  return bookings.some(booking => 
    listing.id === Number(booking.listingId) && email === booking.owner
  );
};

const compareBooking = (bookings, email) => (a, b) => {
  return isMyBooking(b, bookings, email) - isMyBooking(a, bookings, email);
};