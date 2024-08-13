import axios from "axios";
export function queryTemplate(data) {
  return axios.get('/api/list', { params: data });
}

export function queryApi(
  href,
  params = {}
) {
  return axios.post(href, params);
}
