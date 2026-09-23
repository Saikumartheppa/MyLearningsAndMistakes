import { Profile , Settings , Interests , validateProfile , validateInterests , validateSettings } from "./tabForm"
export const ACCORDIAN_ITEMS = [
  {
    title: "JavaScript Basics",
    content: "Learn variables, functions, and loops in JavaScript.",
    id:1
  },
  {
    title: "React.js Overview",
    content: "Understand components, state, and props in React.",
    id:2
  },
  {
    title: "Node.js",
    content: "Basics of server-side development with Node.js.",
    id:3
  },
  {
    title: "Full-Stack Development",
    content: "Build full-stack apps with React and Node.js.",
    id:4
  },
];
// Added config for tabs , so in future if we want to add new tab we can simply add the new obj to this list
export const TABS = [
  {
    name : "Profile",
    component : Profile,
    validate:validateProfile
  },
  {
   name : "Interests",
   component : Interests,
   validate: validateInterests,
 },
   {
    name : "Settings",
    component : Settings,
    validate : validateSettings
  },
]
export const OTP_INPUT_DIGITS = 6;
export const TODO_FILTER_BUTTONS = ['All' , 'Active' , 'Completed'];
export const TODOS_STORAGE_KEY = 'todos';
export const ROWS = 8;
export const COLUMNS = 8;