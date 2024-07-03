import { gql } from "@apollo/client";

export const ALL_FOOD_MENUS = gql`
    query allFoodMenus ($filter: String) {
        allFoodMenus (filter: $filter){
            id
            program {
                id
                program
            }
            name 
        }
    }
`;

export const CREATE_FOOD_MENU = gql`
    mutation createFoodMenu ($name: String, $program: ID){
        createFoodMenu(name: $name, program: $program){
            foodMenu{
                id
            }
        }
    }

`;

export const UPDATE_FOOD_MENU = gql `
    mutation updateFoodMenu ($id: ID, $name: String, $program: ID){
        updateFoodMenu (id: $id, name: $name, program: $program){
            foodMenu{
                id
            }
        }
    }
`;

export const DELETE_FOOD_MENU = gql `
    mutation deleteFoodMenu ($id: ID){
        deleteFoodMenu (id: $id){
            foodMenu{
                name
            }
        }
    }
`;

export const ALL_FOODS = gql `
    query allFoods ($foodMenu: ID!) {
        allFoods (foodMenu: $foodMenu){
            id
            name
            ingredients
        }
    }
`;

export const CREATE_FOOD = gql `
    mutation createFood ($foodMenu: ID, $ingredients: String, $name: String){
        createFood (foodMenu: $foodMenu, ingredients: $ingredients, name: $name) {
            food {
                id
            }
        }
    }
`;

export const UPDATE_FOOD = gql `
    mutation updateFood ($foodMenu: ID, $id: ID, $ingredients: String, $name: String){
        updateFood (foodMenu: $foodMenu, id: $id, ingredients: $ingredients, name: $name){
            food {
                id
            }
        }
    }
`;

export const DELETE_FOOD = gql `
    mutation deleteFood ($id: ID){
        deleteFood (id: $id){
            food {
                name
            }
        }
    }
`;

export const ALL_DAILY_MENUS = gql`
    query allDailyMenus {
        allDailyMenus {
            id
            program {
                program
            }
            name
            createdAt
        }
    }
`

export const CREATE_DAILY_MENU = gql`
    mutation createDailyMenu ($name: String, $program: ID) {
        createDailyMenu (name: $name, program: $program) {
            dailyMenu {
                id
            }
        }
    }
`

export const DELETE_DAILY_MENU = gql `
    mutation deleteDailyMenu ($id: ID){
        deleteDailyMenu (id: $id){
            dailyMenu {
                name
            }
        }
    }
`

export const ALL_DAILY_MENU_FOODS = gql `
    query allDailyMenuFoods ($dailyMenu: ID!){
        allDailyMenuFoods (dailyMenu: $dailyMenu){
            id
            food {
                name
                ingredients
                foodfileSet {
                    image
                }
            }
        }
    }
`;

export const FOOD_BYID = gql `
    query foodById ($id: ID!){
        foodById (id: $id){
            id
        }
    }
`;

export const ALL_FOOD_FILES_BYFOOD = gql `
    query allFoodFilesByFood ($food: ID!){
        allFoodFilesByFood (food: $food){
            id
            image
        }
    }
`;

export const CREATE_FOOD_FILE = gql `
    mutation createFoodFile ($food: ID, $image: Upload!){
        createFoodFile (food: $food, image: $image){
            foodFile {
                id
            }
        }
    }
`;

export const DELETE_FOOD_FILE = gql `
    mutation deleteFoodFile ($id: ID){
        deleteFoodFile (id: $id){
            foodFile {
                image
            }
        }
    }
`

export const CREATE_DAILY_MENU_FOOD = gql`
    mutation createDailyMenuFood ($dailyMenu: ID, $food: ID) {
        createDailyMenuFood (dailyMenu: $dailyMenu, food: $food) {
            dailyMenuFood {
                id
            }
        }
    }
`