const URL = "https://fakestoreapi.com/products";
let allData = [];
let page = 1;
const rows = 10;

let populatedData = [];
let selectedCategories = [];
let filteredList = null;
let sortValue;
let searchText;
let debounceTimeout;

/**
 * Creating Elemenst
 *
 * @param {*} type of element
 * @param {*} className to be adde
 * @return {*} Element with className
 */
const createElement = (type, className) => {
  const userEle = document.createElement(type);

  if (className) {
    userEle.classList.add(className);
  }

  return userEle;
};

/**
 * Filters data with respect to search, sort and filets
 *
 */
const filterData = () => {
  if (selectedCategories.length > 0) {
    filteredList = allData.filter((o) =>
      selectedCategories.includes(o?.category)
    );
  } else {
    filteredList = allData;
  }

  if (searchText) {
    filteredList = filteredList.filter(
      ({ title }) => title.toLowerCase().indexOf(searchText.toLowerCase()) > -1
    );
  }
  if (sortValue) {
    sortValue === 1
      ? filteredList.sort((a, b) => a.price - b.price)
      : filteredList.sort((a, b) => b.price - a.price);
  }
  page = 1;
  populateList(filteredList);
  if (page * rows > filteredList.length) {
    loadButton.style.display = "none";
  } else {
    loadButton.style.display = "block";
  }
};

/**
 * Display categories on filters
 *
 * @param {*} ele
 */
const displayCategories = (ele) => {
  const categories = [...new Set(allData.map((product) => product.category))];
  const categoryContainer = ele || document.getElementById("category");

  categories.forEach((category) => {
    const label = createElement("div", "cat-input");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "category";
    checkbox.value = category;

    checkbox.addEventListener("click", function () {
      if (checkbox.checked) {
        selectedCategories.push(category);
      } else {
        selectedCategories = selectedCategories.filter(
          (item) => item !== category
        );
      }

      filterData();
    });

    label.appendChild(checkbox);
    const text = createElement("span", "text-cat");
    text.textContent = category;
    label.appendChild(text);
    categoryContainer.appendChild(label);
  });
};

/**
 * It populates data in the screen
 *
 * @param {*} filteredList
 * @param {boolean} [fromLoadMore=false]
 */
const populateList = (filteredList, fromLoadMore = false) => {
  let dataToLoop = allData.slice((page - 1) * rows, rows * page);
  if (filteredList) {
    dataToLoop = filteredList.slice((page - 1) * rows, rows * page);
    if (!fromLoadMore) {
      const div = document.getElementsByClassName("item-2")[0];
      div.innerHTML = "";
    }
  }

  dataToLoop.forEach((item) => {
    const userDiv = createElement("div", "item-x");
    const item2 = document.getElementsByClassName("item-2")[0];
    const imageElement = createElement("img", "image-width");
    const imageDiv = createElement("div", "image-div");

    imageElement.src = item.image;
    imageDiv.appendChild(imageElement);
    userDiv.appendChild(imageDiv);

    const detailsDiv = createElement("div", "details-div");
    detailsDiv.innerHTML = "<strong>" + item?.title + "</strong>";
    userDiv.appendChild(detailsDiv);

    const priceDiv = createElement("div", "price-div");
    priceDiv.innerHTML = "$" + item?.price;
    userDiv.appendChild(priceDiv);

    item2.appendChild(userDiv);
  });
  page++;
};

/**
 * Resize function
 *
 */
const resize = () => {
    if(window.innerWidth <=640) {
        document.getElementById('filter-results').style.display='block';
        document.getElementById('sort-products').style.display='block';
    }else {
        document.getElementById('filter-results').style.display='none';
        document.getElementById('sort-products').style.display='none';
        document.getElementById('popup').style.display = 'none';

        if(window.innerWidth <= 1024) {
            document.getElementsByClassName('item-1-x')[0].style.display = 'none';
        }else {
            document.getElementsByClassName('item-1-x')[0].style.display = 'block';
        }
    }
}

/**
 * Resize detector
 *
 */
const windowResizer = () => {
    window.addEventListener('resize', function() {
        resize();
    });
}

// Dom load events
document.addEventListener("DOMContentLoaded", function () {
    windowResizer();
    resize();
  const loadButton = document.getElementById("loadButton");
  const selectBox = document.getElementById("priceSort");
  const searchBox = document.getElementById("search-box");
  const fResults = document.getElementById('filter-results');
  const sProducts = document.getElementById('sort-products');
  const applyButton = document.getElementById('applyButton');
  const closePopupBtn =  document.getElementById('closePopupBtn');
  const selectBox1 = document.getElementById("priceSort-pop");

  loadButton.addEventListener("click", function () {
    populateList(filteredList, true);
    if (page * rows > allData.length) {
      loadButton.style.display = "none";
    }
  });

  selectBox.addEventListener("change", function () {
    sortValue = parseInt(selectBox.value);
    filterData();
  });

  selectBox1.addEventListener("change", function () {
    sortValue = parseInt(selectBox1.value);
    filterData();
  });

  searchBox.addEventListener("input", function () {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      searchText = searchBox.value;
      filterData();
    }, 500);
  });

  fResults.addEventListener("click", function () {
    document.getElementById("popup").style.display = 'block';
    if (!selectedCategories?.length && !sortValue) {
        displayCategories(document.getElementById('category-pop'));
    }
  });

  sProducts.addEventListener("click", function () {
    document.getElementById("popup").style.display = 'block';
    if (!selectedCategories?.length && !sortValue) {
        displayCategories(document.getElementById('category-pop'));
    }
  });

  applyButton.addEventListener("click", function () {
    document.getElementById("popup").style.display = 'none';
  });
  closePopupBtn.addEventListener("click", function () {
    document.getElementById("popup").style.display = 'none';
  });

  // Fetching data  
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("shimmers-div").style.display = "none";
      document.getElementById("items-div").style.display = "grid";
      if (window.innerWidth <= 640) {
        document.getElementById('sort-products').style.display = 'block';
        document.getElementById('filter-results').style.display = 'block';
      }
      allData = data;
      populateList();
      loadButton.style.display = "block";
      displayCategories();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("An unexpected error occurred.");
    });
});
