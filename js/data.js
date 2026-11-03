/**
 * FoodieHub - Restaurant & Food Menu Data
 * Academic Web Development Mini Project
 * Student: A. Revanth Kumar | Roll No: 25CS003583 | CSE (Cyber Security)
 */

const FOOD_CATEGORIES = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "Pizza", name: "Pizza", icon: "🍕" },
  { id: "Burgers", name: "Burgers", icon: "🍔" },
  { id: "Biryani", name: "Biryani", icon: "🍲" },
  { id: "South Indian", name: "South Indian", icon: "🥞" },
  { id: "Chinese", name: "Chinese", icon: "🍜" },
  { id: "Desserts", name: "Desserts", icon: "🍰" },
  { id: "Beverages", name: "Beverages", icon: "🥤" }
];

const RESTAURANTS = [
  {
    id: "mehfil-biryani",
    name: "Mehfil Biryani & Kebabs",
    category: "Biryani",
    cuisine: ["Biryani", "North Indian", "Mughlai", "Kebabs"],
    rating: 4.5,
    reviewCount: "1,420+",
    deliveryTime: "25-30 mins",
    deliveryMinutes: 28,
    priceForTwo: 350,
    isPureVeg: false,
    address: "Plot 42, Main Road, MVP Colony, Visakhapatnam",
    area: "MVP Colony",
    image: "assets/images/biryani.jpg",
    offer: "50% OFF up to ₹100",
    menu: [
      {
        id: "mb-101",
        name: "Hyderabadi Chicken Dum Biryani",
        category: "Biryani",
        price: 299,
        isVeg: false,
        isBestseller: true,
        rating: 4.8,
        description: "Authentic dum biryani slow-cooked with tender marinated chicken, fragrant basmati rice, brown onions, fresh mint, and boiled egg. Served with mirchi ka salan and onion raita."
      },
      {
        id: "mb-102",
        name: "Special Mutton Dum Biryani",
        category: "Biryani",
        price: 399,
        isVeg: false,
        isBestseller: true,
        rating: 4.9,
        description: "Aromatic long-grain basmati rice layered with succulent tender baby goat pieces marinated in chef special royal spices."
      },
      {
        id: "mb-103",
        name: "Paneer Tikka Biryani",
        category: "Biryani",
        price: 249,
        isVeg: true,
        isBestseller: false,
        rating: 4.4,
        description: "Charcoal grilled paneer cubes tossed in tandoori spices and layered with aromatic saffron rice. Served with refreshing raita."
      },
      {
        id: "mb-104",
        name: "Murgh Malai Kebab (6 Pcs)",
        category: "Starters",
        price: 279,
        isVeg: false,
        isBestseller: true,
        rating: 4.7,
        description: "Boneless chicken chunks marinated in fresh cream, cashew paste, mild cheese and green cardamom, roasted to perfection in clay oven."
      },
      {
        id: "mb-105",
        name: "Butter Chicken Delight",
        category: "Main Course",
        price: 310,
        isVeg: false,
        isBestseller: true,
        rating: 4.6,
        description: "Tender tandoori chicken simmered in a rich velvety tomato and butter gravy finished with fresh cream and dried fenugreek leaves."
      },
      {
        id: "mb-106",
        name: "Paneer Butter Masala",
        category: "Main Course",
        price: 260,
        isVeg: true,
        isBestseller: false,
        rating: 4.5,
        description: "Soft fresh cottage cheese cubes cooked in a mild sweet and savory spiced creamy cashew gravy."
      },
      {
        id: "mb-107",
        name: "Garlic Butter Naan",
        category: "Breads",
        price: 55,
        isVeg: true,
        isBestseller: false,
        rating: 4.6,
        description: "Fluffy leavened oven-baked flatbread topped with minced roasted garlic, fresh coriander and salted Amul butter."
      },
      {
        id: "mb-108",
        name: "Shahi Gulab Jamun with Rabdi",
        category: "Desserts",
        price: 110,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        description: "Warm soft khoya dumplings soaked in rose saffron syrup served with chilled thickened pistachio rabdi."
      }
    ]
  },
  {
    id: "bella-napoli",
    name: "Bella Napoli Woodfired Pizzeria",
    category: "Pizza",
    cuisine: ["Pizza", "Italian", "Pasta", "Garlic Breads"],
    rating: 4.6,
    reviewCount: "980+",
    deliveryTime: "30-35 mins",
    deliveryMinutes: 32,
    priceForTwo: 550,
    isPureVeg: false,
    address: "Shop 12, Harbour Park Road, Beach Road, Visakhapatnam",
    area: "Beach Road",
    image: "assets/images/pizza.jpg",
    offer: "FLAT ₹125 OFF on ₹499",
    menu: [
      {
        id: "bn-201",
        name: "Margherita Basilico Pizza (11 inch)",
        category: "Pizza",
        price: 349,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        description: "Traditional Neapolitan thin sourdough crust, San Marzano tomato sauce, fresh buffalo mozzarella, virgin olive oil and torn organic sweet basil."
      },
      {
        id: "bn-202",
        name: "Fiery Chicken Pepperoni Pizza",
        category: "Pizza",
        price: 449,
        isVeg: false,
        isBestseller: true,
        rating: 4.9,
        description: "Artisan woodfired crust topped with smoked chicken pepperoni slices, spicy marinara, melted mozzarella and red chili flakes."
      },
      {
        id: "bn-203",
        name: "Farmhouse Garden Veggie Pizza",
        category: "Pizza",
        price: 389,
        isVeg: true,
        isBestseller: false,
        rating: 4.5,
        description: "Crispy crust loaded with bell peppers, sweet corn kernels, button mushrooms, black olives, onions and herb mozzarella."
      },
      {
        id: "bn-204",
        name: "Creamy Alfredo Fettuccine Pasta",
        category: "Pasta",
        price: 320,
        isVeg: true,
        isBestseller: false,
        rating: 4.6,
        description: "Al dente fettuccine ribbons tossed in a silky parmesan, heavy cream and butter sauce with sautéed garlic."
      },
      {
        id: "bn-205",
        name: "Cheesy Stuffed Garlic Bread",
        category: "Starters",
        price: 189,
        isVeg: true,
        isBestseller: true,
        rating: 4.7,
        description: "Freshly baked baguette stuffed with roasted garlic butter, molten mozzarella cheese, and Italian oregano herbs."
      },
      {
        id: "bn-206",
        name: "Classic Italian Tiramisu",
        category: "Desserts",
        price: 210,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        description: "Espresso dipped savoiardi ladyfinger cookies layered with velvety mascarpone cream and dusted with dark cocoa powder."
      }
    ]
  },
  {
    id: "udipi-krishna",
    name: "Udipi Krishna Grand",
    category: "South Indian",
    cuisine: ["South Indian", "Pure Veg", "Breakfast", "Filter Coffee"],
    rating: 4.7,
    reviewCount: "3,200+",
    deliveryTime: "20-25 mins",
    deliveryMinutes: 22,
    priceForTwo: 220,
    isPureVeg: true,
    address: "2nd Lane, Main Commercial Street, Dwaraka Nagar, Visakhapatnam",
    area: "Dwaraka Nagar",
    image: "assets/images/dosa.jpg",
    offer: "20% OFF on all Dosas",
    menu: [
      {
        id: "uk-301",
        name: "Special Mysore Masala Dosa",
        category: "South Indian",
        price: 110,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        description: "Crispy golden crepe lined with spicy red chili garlic chutney, filled with potato onion palya and pure ghee. Served with 3 coconut chutneys and hot sambar."
      },
      {
        id: "uk-302",
        name: "Ghee Roast Paper Plain Dosa",
        category: "South Indian",
        price: 95,
        isVeg: true,
        isBestseller: false,
        rating: 4.6,
        description: "Ultra-thin and crispy roasted paper dosa prepared with pure cow ghee. Light, airy, and served with homestyle coconut chutney."
      },
      {
        id: "uk-303",
        name: "Steamed Button Idli & Crispy Medu Vada",
        category: "South Indian",
        price: 85,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        description: "Two fluffy steamed rice cakes and one crunchy lentil donut served with piping hot vegetable sambar and peanut chutney."
      },
      {
        id: "uk-304",
        name: "Rava Onion Dosa",
        category: "South Indian",
        price: 120,
        isVeg: true,
        isBestseller: false,
        rating: 4.4,
        description: "Crispy semolina crepe studded with finely diced onions, green chilies, ginger, and cracked black pepper."
      },
      {
        id: "uk-305",
        name: "Bisi Bele Bath with Boondi",
        category: "Main Course",
        price: 130,
        isVeg: true,
        isBestseller: false,
        rating: 4.5,
        description: "Traditional Karnataka spiced rice, lentils, and mixed garden vegetables cooked with aromatic ghee and topped with crispy kara boondi."
      },
      {
        id: "uk-306",
        name: "Authentic Degree Filter Coffee",
        category: "Beverages",
        price: 45,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        description: "Freshly brewed chicory coffee decoction frothed with boiling whole milk in a traditional brass dabarah and tumbler."
      }
    ]
  },
  {
    id: "burger-den",
    name: "The Burger Den & Wings",
    category: "Burgers",
    cuisine: ["Burgers", "Fast Food", "American", "Crispy Fries"],
    rating: 4.4,
    reviewCount: "1,150+",
    deliveryTime: "25-30 mins",
    deliveryMinutes: 27,
    priceForTwo: 380,
    isPureVeg: false,
    address: "Siripuram Junction, Near Tech Park, Visakhapatnam",
    area: "Siripuram",
    image: "assets/images/hero_banner.jpg",
    offer: "Free Peri Peri Fries on ₹350",
    menu: [
      {
        id: "bd-401",
        name: "Smoky BBQ Double Cheese Smash Burger",
        category: "Burgers",
        price: 249,
        isVeg: false,
        isBestseller: true,
        rating: 4.8,
        description: "Two seared chicken patties, double cheddar cheese slices, caramelized onions, crispy lettuce, and smoky hickory barbecue sauce on toasted brioche."
      },
      {
        id: "bd-402",
        name: "Crispy Veg Maharaja Burger",
        category: "Burgers",
        price: 189,
        isVeg: true,
        isBestseller: true,
        rating: 4.5,
        description: "Crispy spiced potato, corn and peas patty topped with tangy burger mayo, sliced tomatoes, gherkins and cheddar in a sesame bun."
      },
      {
        id: "bd-403",
        name: "Peri Peri Chicken Crunchy Burger",
        category: "Burgers",
        price: 229,
        isVeg: false,
        isBestseller: false,
        rating: 4.6,
        description: "Batter-fried crunchy chicken fillet dusted with African peri-peri spice mix, spicy garlic mayo, and shredded crisp cabbage."
      },
      {
        id: "bd-404",
        name: "Loaded Cheesy Peri-Peri Fries",
        category: "Starters",
        price: 149,
        isVeg: true,
        isBestseller: true,
        rating: 4.7,
        description: "Golden salted french fries shaken in spicy peri-peri rub and smothered with warm melted cheddar cheese sauce."
      },
      {
        id: "bd-405",
        name: "Crispy Hot Chicken Wings (6 Pcs)",
        category: "Starters",
        price: 239,
        isVeg: false,
        isBestseller: false,
        rating: 4.4,
        description: "Deep fried chicken wings tossed in tangy cayenne pepper hot buffalo sauce. Served with creamy herb ranch dip."
      },
      {
        id: "bd-406",
        name: "Thick Chocolate Fudge Milkshake",
        category: "Beverages",
        price: 140,
        isVeg: true,
        isBestseller: false,
        rating: 4.7,
        description: "Rich dark chocolate ice cream blended with chocolate syrup, milk, and chocolate flakes."
      }
    ]
  },
  {
    id: "dragon-wok",
    name: "Dragon Wok & Asian Express",
    category: "Chinese",
    cuisine: ["Chinese", "Asian", "Noodles", "Dimsums", "Momos"],
    rating: 4.3,
    reviewCount: "860+",
    deliveryTime: "30-35 mins",
    deliveryMinutes: 32,
    priceForTwo: 420,
    isPureVeg: false,
    address: "Waltair Uplands, VIP Road, Visakhapatnam",
    area: "Waltair Uplands",
    image: "assets/images/hero_banner.jpg",
    offer: "FLAT ₹80 OFF on ₹399",
    menu: [
      {
        id: "dw-501",
        name: "Chili Garlic Hakka Noodles",
        category: "Chinese",
        price: 199,
        isVeg: true,
        isBestseller: true,
        rating: 4.6,
        description: "Wok-tossed noodles with shredded cabbage, bell peppers, spring onions, burnt garlic, and spicy red chili soy reduction."
      },
      {
        id: "dw-502",
        name: "Chicken Manchurian (Gravy)",
        category: "Chinese",
        price: 259,
        isVeg: false,
        isBestseller: true,
        rating: 4.7,
        description: "Golden fried minced chicken dumplings cooked in a classic savory scallion, ginger, and soy sauce gravy."
      },
      {
        id: "dw-503",
        name: "Paneer Chili Dry",
        category: "Starters",
        price: 220,
        isVeg: true,
        isBestseller: true,
        rating: 4.5,
        description: "Wok fried paneer cubes with green chilies, onions, capsicum, soy, and toasted sesame seeds."
      },
      {
        id: "dw-504",
        name: "Steamed Chicken Momos (6 Pcs)",
        category: "Starters",
        price: 179,
        isVeg: false,
        isBestseller: false,
        rating: 4.8,
        description: "Soft Tibetan style steamed dumplings stuffed with finely minced chicken, herbs, and served with fiery fiery red chili chutney."
      },
      {
        id: "dw-505",
        name: "Egg & Chicken Fried Rice",
        category: "Chinese",
        price: 239,
        isVeg: false,
        isBestseller: false,
        rating: 4.4,
        description: "Fluffy rice tossed on high heat with eggs, chicken cubes, fresh carrots, beans, and sesame seasoning."
      }
    ]
  },
  {
    id: "sweet-tooth",
    name: "Sweet Tooth Bakery & Waffles",
    category: "Desserts",
    cuisine: ["Desserts", "Bakery", "Ice Cream", "Waffles"],
    rating: 4.8,
    reviewCount: "1,750+",
    deliveryTime: "15-20 mins",
    deliveryMinutes: 18,
    priceForTwo: 280,
    isPureVeg: true,
    address: "Kirlampudi Layout, Near Beach Walk, Visakhapatnam",
    area: "Kirlampudi Layout",
    image: "assets/images/hero_banner.jpg",
    offer: "Buy 1 Get 1 on Belgian Waffles",
    menu: [
      {
        id: "st-601",
        name: "Warm Belgian Nutella Waffle",
        category: "Desserts",
        price: 179,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        description: "Freshly baked crispy golden Belgian waffle smothered with creamy hazelnut Nutella spread and roasted almond slivers."
      },
      {
        id: "st-602",
        name: "Death By Chocolate Jar Cake",
        category: "Desserts",
        price: 149,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        description: "Layers of moist Dutch chocolate sponge, dark chocolate ganache, chocolate mousse, and choco chips packed in a glass jar."
      },
      {
        id: "st-603",
        name: "New York Baked Blueberry Cheesecake",
        category: "Desserts",
        price: 199,
        isVeg: true,
        isBestseller: false,
        rating: 4.7,
        description: "Velvety cream cheese baked on a buttery graham cracker crust, topped with wild blueberry compote."
      },
      {
        id: "st-604",
        name: "Warm Chocolate Walnut Brownie with Ice Cream",
        category: "Desserts",
        price: 139,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        description: "Fudgy warm walnut chocolate brownie served with a scoop of Madagascar vanilla bean ice cream."
      }
    ]
  },
  {
    id: "chai-snack-hub",
    name: "Chai & Snack Hub",
    category: "Beverages",
    cuisine: ["Beverages", "Snacks", "Tea", "Coffee", "Street Food"],
    rating: 4.5,
    reviewCount: "2,400+",
    deliveryTime: "15-20 mins",
    deliveryMinutes: 17,
    priceForTwo: 160,
    isPureVeg: true,
    address: "Opposite Andhra University Gate, Maddilapalem, Visakhapatnam",
    area: "Maddilapalem",
    image: "assets/images/dosa.jpg",
    offer: "Tea + Samosa Combo at ₹79",
    menu: [
      {
        id: "ch-701",
        name: "Ginger Elaichi Dum Chai (Serves 2)",
        category: "Beverages",
        price: 70,
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        description: "Hand-pounded fresh ginger and green cardamom simmered with premium Assam tea leaves and milk in a traditional flask."
      },
      {
        id: "ch-702",
        name: "Cold Brew Coffee with Vanilla Cream",
        category: "Beverages",
        price: 110,
        isVeg: true,
        isBestseller: false,
        rating: 4.6,
        description: "16-hour steeped Arabica cold brew poured over ice and crowned with sweet vanilla cold foam."
      },
      {
        id: "ch-703",
        name: "Crispy Punjabi Samosa (2 Pcs)",
        category: "Snacks",
        price: 60,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        description: "Golden flaky pastry pockets stuffed with spiced potato and green peas masala. Served with mint chutney and sweet saunth tamarind sauce."
      },
      {
        id: "ch-704",
        name: "Bun Maska with Jam",
        category: "Snacks",
        price: 50,
        isVeg: true,
        isBestseller: false,
        rating: 4.5,
        description: "Soft sweet bakery bun toasted with generous layers of salted butter and mixed fruit jam."
      },
      {
        id: "ch-705",
        name: "Fresh Mint Lemonade Cooler",
        category: "Beverages",
        price: 65,
        isVeg: true,
        isBestseller: false,
        rating: 4.4,
        description: "Zesty freshly squeezed lemon juice, crushed mint sprigs, black salt, and sparkling soda."
      }
    ]
  },
  {
    id: "royal-punjabi",
    name: "Royal Punjabi Rasoi",
    category: "Biryani",
    cuisine: ["North Indian", "Tandoori", "Curries", "Thalis"],
    rating: 4.4,
    reviewCount: "890+",
    deliveryTime: "30-35 mins",
    deliveryMinutes: 30,
    priceForTwo: 480,
    isPureVeg: false,
    address: "Opposite RTC Complex, Station Road, Visakhapatnam",
    area: "Station Road",
    image: "assets/images/biryani.jpg",
    offer: "25% OFF above ₹399",
    menu: [
      {
        id: "rp-801",
        name: "Dal Makhani Slow-Simmered (12 Hours)",
        category: "Main Course",
        price: 240,
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        description: "Whole black urad lentils and kidney beans slow-cooked overnight with fresh cream, butter, and mild Kashmiri spices."
      },
      {
        id: "rp-802",
        name: "Amritsari Kulcha with Chole",
        category: "Main Course",
        price: 180,
        isVeg: true,
        isBestseller: true,
        rating: 4.7,
        description: "Flaky crispy leavened tandoor bread stuffed with spiced potatoes and onions, served with spicy Punjabi chickpea curry and onion pickle."
      },
      {
        id: "rp-803",
        name: "Tandoori Murgh (Half)",
        category: "Starters",
        price: 260,
        isVeg: false,
        isBestseller: false,
        rating: 4.6,
        description: "Chicken on the bone marinated in thick hung yogurt, mustard oil, and fiery Punjabi tandoori spices, smoked in charcoal tandoor."
      },
      {
        id: "rp-804",
        name: "Jeera Basmati Rice",
        category: "Main Course",
        price: 130,
        isVeg: true,
        isBestseller: false,
        rating: 4.3,
        description: "Aromatic long-grain basmati rice tempered with golden roasted cumin seeds and desi ghee."
      }
    ]
  }
];

// Helper functions for data lookup
function getRestaurantById(id) {
  if (!id) return RESTAURANTS[0];
  return RESTAURANTS.find(r => r.id === id) || RESTAURANTS[0];
}

function getAllRestaurants() {
  return RESTAURANTS;
}

function getAllCategories() {
  return FOOD_CATEGORIES;
}
