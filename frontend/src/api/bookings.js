
import requestApi from './request.js';

export function getBookings(){
  return requestApi({
    url: '/bookings',
    methods: 'GET',
  })
}

export function newBook(params){
  const { ...others } = params
  return requestApi({
    url: `/bookings/new/${params.id}`,
    params: others,
  })
}

export function acceptBooking(bookingid){
  return requestApi({
    url: `/bookings/accept/${bookingid}`,
    methods: 'PUT',
  })
}

export function rejectBooking(bookingid){
  return requestApi({
    url: `/bookings/decline/${bookingid}`,
    methods: 'PUT',
  })
}

export const deleteBooking = id =>{
  return requestApi({
    url: `/bookings/${id}`,
    methods: 'DELETE'
  })
}

