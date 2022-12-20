if ("geolocation" in navigator) {
        console.log("geolocation available");
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;


          const data = { lat, lon };
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          };
          const response = await fetch("/api2", options);
          const json = await response.json();
          console.log(json);
        });
      } else {
        console.log("geolocation not available");
      }
