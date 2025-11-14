import { useEffect} from "react";

function Groups({ setPopup }: { setPopup: Function }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-page", "groups");
  }, []);
    return <div>Groups Page</div>;
}
export default Groups;