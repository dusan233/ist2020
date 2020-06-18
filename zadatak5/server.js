const http = require("http");
const url = require("url");
const fs = require("fs");
const qs = require("querystring");

let oglasi = [
  {
    id: 1,
    name: "Oglas broj 1",
    price: "2000",
    description: "Opis oglasa broj 1",
    category: "automobili",
  },
  {
    id: 2,
    name: "Oglas broj 2",
    price: "2000",
    description: "Opis oglasa broj 2",
    category: "nekretnine",
  },
  {
    id: 3,
    name: "Oglas broj 3",
    price: "8000",
    description: "Opis oglasa broj 3",
    category: "alati",
  },
  {
    id: 4,
    name: "Oglas broj 4",
    price: "1000",
    description: "Opis oglasa broj 4",
    category: "nekretnine",
  },
  {
    id: 5,
    name: "Oglas broj 5",
    price: "5000",
    description: "Opis oglasa broj 5",
    category: "automobili",
  },
];

http
  .createServer(function (req, res) {
    let urlObj = url.parse(req.url, true, true);

    if (req.method === "GET") {
      if (urlObj.pathname === "/") {
        fs.readFile("./index.html", function (err, data) {
          if (err) {
            return;
          }
          res.end(data);
        });
      }
      if (urlObj.pathname === "/dodaj-oglas") {
        fs.readFile("./dodaj.html", function (err, data) {
          if (err) {
            return;
          }
          res.end(data);
        });
      }
      if (urlObj.pathname === "/izmeni-oglas") {
        // const id = parseInt(urlObj.query.id[0]);
        fs.readFile("./izmeni.html", function (err, data) {
          if (err) {
            return;
          }
          res.end(data);
        });
      }
      if (urlObj.pathname === "/oglas") {
        const id = parseInt(urlObj.query.id[0]);
        const oglas = oglasi.filter((el) => el.id === id);
        res.end(JSON.stringify(oglas));
      }
      if (urlObj.pathname === "/svi-oglasi") {
        if (urlObj.query.filter[0] === "" || urlObj.query.filter[0] === "Svi") {
          res.end(JSON.stringify(oglasi));
        } else {
          const filtriraniOglasi = oglasi.filter(
            (el) => el.category === urlObj.query.filter[0]
          );
          res.end(JSON.stringify(filtriraniOglasi));
        }
      }
    }
    if (req.method === "POST") {
      if (urlObj.pathname === "/dodaj-oglas") {
        console.log("hahah");
        let body = "";
        req.on("data", function (data) {
          body += data;
        });
        req.on("end", function () {
          let inputData = qs.parse(body);
          dodajOglas(oglasi.length, inputData);

          res.end();
        });
      }
      if (urlObj.pathname === "/izmeni-oglas") {
        const id = parseInt(urlObj.query.id[0]);
        let body = "";
        req.on("data", function (data) {
          body += data;
        });
        req.on("end", function () {
          let inputData = qs.parse(body);
          oglasi = oglasi.map((el) => {
            if (el.id === id) {
              (el.name = inputData.name),
                (el.description = inputData.description),
                (el.price = inputData.price),
                (el.category = inputData.category);
            }
            return el;
          });

          res.end();
        });
      }
      if (urlObj.pathname === "/obrisi-oglas") {
        const id = parseInt(urlObj.query.id[0]);
        const noviOglasi = oglasi.filter((el) => el.id !== id);
        oglasi = noviOglasi;
        res.end();
      }
    }
  })
  .listen(5000);

function dodajOglas(len, data) {
  let uniqueId = true;
  len++;
  for (let i = 0; i < oglasi.length; i++) {
    if (oglasi[i].id === len) {
      uniqueId = false;
      break;
    }
  }
  if (!uniqueId) {
    dodajOglas(len, data);
  } else {
    oglasi.push({
      id: len,
      name: data.name,
      price: data.price,
      description: data.description,
      category: data.category,
    });
  }
}
