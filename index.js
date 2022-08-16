const axios = require("axios");
const cheerio = require("cheerio");

let initialPage = 0;

function getTotalAdsCount() {
  axios
    .get(
      `https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc&page=${initialPage}`
    )
    .then((response) => {
      const $ = cheerio.load(response.data);
      const featuredArticles = $("main article");
      console.log("total ads ", featuredArticles.length);
    })
    .catch((err) => console.log("Fetch error " + err));
}

function addItem() {
  axios
    .get(
      `https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc&page=${initialPage}`
    )
    .then((response) => {
      const $ = cheerio.load(response.data);
      const featuredArticles = $("main article");
      for (let i = 0; i < featuredArticles.length; i++) {
        let postLinkWrapper = $(featuredArticles[i])
          .find("div h2 a")
          .attr("href");
        let id = $(featuredArticles[i]).attr("id");
        console.log("\n" + `Item url - ${postLinkWrapper}`);
        console.log("\n" + `id - ${id}`);
        console.log("\n----\n\n");
      }
    })
    .catch((err) => console.log("Fetch error " + err));
}

function fetchAds() {
  axios
    .get(
      `https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/od-+2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc&page=${initialPage}`
    )
    .then((response) => {
      const $ = cheerio.load(response.data);
      const featuredArticles = $("main article");

      for (let i = 0; i < featuredArticles.length; i++) {
        let postLinkWrapper = $(featuredArticles[i])
          .find("div h2 a")
          .attr("href");
        scrapeTruckItem(postLinkWrapper);
      }
    })
    .catch((err) => console.log("Fetch error " + err));
}

function scrapeTruckItem(itemUrl) {
  axios
    .get(itemUrl)
    .then((response) => {
      let elems = [];
      let idArray = [];

      const $ = cheerio.load(response.data);

      let title = $(
        "div.offer-summary span.offer-title.big-text.fake-title"
      ).text();

      let price = $("div.offer-summary div.price-wrapper div.offer-price").attr(
        "data-price"
      );

      $("div.offer-meta span.offer-meta__item").each((_, elem) => {
        idArray.push($(elem).text());
      });
      $(
        "div.parametersArea div.offer-params ul.offer-params__list li div"
      ).each((_, elem) => {
        elems.push($(elem).text());
      });

      let obj = {
        title: title.replace(/\n/g, "").trim(),
        price: price.trim(),
        id: idArray[1].replace(/\n/g, "").trim(),
        productionDate: elems[4].replace(/\n/g, "").trim(),
        registraionDate: elems[12].replace(/\n/g, "").trim(),
        power: elems[7].replace(/\n/g, "").trim(),
        mileage: elems[5].replace(/\n/g, "").trim(),
      };
      console.log(obj);
    })
    .catch((err) => console.log("Fetch error " + err));
}

//iterate over pages
function getNextPage() {
  initialPage = initialPage + 1;
  fetchAds();
}

//Scrape all pages, all ads
function getAllAds() {
  for (let i = 1; i <= 13; i++) {
    getNextPage();
  }
}

// addItem();
// fetchAds();
// getTotalAdsCount();
// getNextPage();
getAllAds();
// scrapeTruckItem(
//   "https://www.otomoto.pl/oferta/mercedes-benz-actros-1842ls-ID6EJjNc.html"
// );
