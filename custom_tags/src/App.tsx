import JiraLabels from "./components/JiraLabels";
import MultiTag from "./components/MultiTag";
import Tags from "./components/Tags";
import TagsInput from "./components/TagsInput";
const App = () => {
  return (
    <div>
      <TagsInput />
      <Tags/>
      <MultiTag />
      <JiraLabels />
    </div>
  );
};

export default App;