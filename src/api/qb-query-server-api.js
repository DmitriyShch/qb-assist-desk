import config from '../../config/config'
import axios from 'axios'

const BASE_PATH = `http://${config.qb_query_server_host}:${config.qb_query_server_port}`

const http = axios.create({
  baseURL: BASE_PATH,
})

export default http