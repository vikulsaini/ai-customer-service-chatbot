import { Link } from "react-router-dom";
import Button from "../components/Button";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#eef7f4] p-5 text-center dark:bg-[#07111f] dark:text-white"><div><h1 className="text-7xl font-black">404</h1><p className="mb-6 mt-3 text-slate-600 dark:text-slate-300">The page you requested does not exist.</p><Link to="/"><Button>Go home</Button></Link></div></main>;
}
