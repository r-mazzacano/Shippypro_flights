import axios from 'axios';

export default axios.create({
  baseURL: 'https://recruitment.shippypro.com/flight-engine/api/',
  headers: {
    Authorization: "Bearer 1|MN9ruQV0MFEsgOzMo8crw8gB575rsTe2H5U1y2Lj"
  }
});