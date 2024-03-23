
import requestApi from './request.js';
import { DEFAULT_MAP_PARAMS } from '@/constants'
export function listings(params){
  return requestApi({
    url: '/listings',
    methods: 'GET',
    params
  })
}

export function createList(params){
  return requestApi({
    url: '/listings/new',
    params,
  })
}

export function getListById(id){
  return requestApi({
    url: `/listings/${id}`,
    methods: 'GET',
  });
}

export function deleteList(id){
  return requestApi({
    url: `/listings/${id}`,
    methods: 'DELETE',
  });
}

export function editList(id, params){
  console.log(params)
  return requestApi({
    url: `/listings/${id}`,
    methods: 'PUT',
    params
  });
}

export function publishList (id, params){
  console.log(params)
  return requestApi({
    url: `/listings/publish/${id}`,
    methods: 'PUT',
    params
  });
}

export function unpublishList(id){
  return requestApi({
    url: `/listings/unpublish/${id}`,
    methods: 'PUT',
  });
}

export function addNewReview(params){
  const {listingid, bookingid} = params
  return requestApi({
    url: `/listings/${listingid}/review/${bookingid}`,
    methods: 'PUT',
    params: {
      review: params
    }
  });
}

export function getGisLocation(address){
  return requestApi({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${DEFAULT_MAP_PARAMS.APP_KEY}`,
    methods: 'GET',
    type: "Link"
  });
}