import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

export default function Polychromatic() {
  const [image, setImage] = useState([]);
  const [images, setImages] = useState([]);
  const [time, setTime] = useState("time loading...");
  const [date, setDate] = useState("date loading...");
  const [coords, setCoords] = useState({});

  const apiKey = process.env.NEXT_PUBLIC_NAME;
  const url = `https://epic.gsfc.nasa.gov/api/natural?api_key=${apiKey}`;
  const getPolychromaticData = async () => {
    const res = await axios.get(url);
    const data = await res.data;
    console.log(data);

    const caption = data[0].caption;
    const date = data[0].date.split(" ")[0];
    const dateFormatted = date.replaceAll("-", "/");

    let times = [];
    let images = [];

    for (let i = 0; i < data.length; i++) {
      let time = data[i].date.split(" ")[1];
      let coords = data[i].centroid_coordinates;
      let image = `https://epic.gsfc.nasa.gov/archive/natural/${dateFormatted}/png/${data[i].image}.png`;

      times.push(time);
      images.push({
        image: image,
        time: time,
        coords: coords,
      });
    }

    setDate(date);
    setImages(images);
    setImage(images[0].image);
    setTime(times[0]);
    setCoords([images[0].coords.lat, images[0].coords.lon]);

    console.log(images);
  };

  useEffect(() => {
    getPolychromaticData();
  }, []);

  return (
    <div className='polyBody'>

      <div className='headPolyDiv'>
        <h1 className="headPoly">
        Polychromatic
         </h1>
      </div>


      <div>
        <div className="bigImageDiv">
          <div className="bigImage">
            <Image
              src={image}
              alt={image}
              width={500}
              height={500}
            />
          </div>
          <div className="textDiv">
              <div className="dateText">{time}</div>
              <div className="coordText">
                {coords[0]}, {coords[1]}
              </div>
              </div>
          </div>

        <table className="tableDiv">
          <thead className="tableHead">
            <tr>
              <th className="timeText">
                Time
              </th>
              <th className="latText">
                Latitude
              </th>
              <th className="longText">
                Longitude
              </th>
              <th className="imgText">
                Image
              </th>
              <th className="viewText">
                View
              </th>
            </tr>
          </thead>

          
          <tbody>
            {images &&
              images.map((o, index) => {
                return (
                  <tr key={index}>
                    <td className="column">{o.time}</td>
                    <td className="column">
                      {o.coords.lat}
                    </td>
                    <td className="column">
                      {o.coords.lon}
                    </td>
                    <td className="column">
                      <Image
                        src={o.image}
                        alt={o.image}
                        width={150}
                        height={150}
                      />
                    </td>
                    <td className="column">
                      <button
                        onClick={() => {
                          setImage(o.image);
                          setTime(o.time);
                          setCoords([o.coords.lat, o.coords.lon]);
                          document.body.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="viewButton"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
