import ReactDOM from "react-dom";
import CheckboxList from "./manga-list";
function Popup() {
  return (
    <div className="Popup">
      <CheckboxList/>
    </div>
  );
}
export default Popup;
ReactDOM.render(<Popup />, document.getElementById("react-target"));
