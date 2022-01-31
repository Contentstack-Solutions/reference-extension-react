export default function Table(props) {
  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>Title</th>
          <th>UID</th>
          <th>Author</th>
          <th>Biography</th>
          <th>Occupation</th>
          <th>Tags</th>
        </tr>
        {props.filteredData.map((i) => {
          return (
            <tr key={i.updated_at}>
              <td>
                <input
                  type="checkbox"
                  id="vehicle1"
                  name="vehicle1"
                  value="Bike"
                />
              </td>
              <td key={i.title}>{i.title}</td>
              <td key={i.uid}>{i.uid}</td>
              <td key={i.author}>{i.author}</td>
              <td key={i.biography}>{i.biography}</td>
              <td key={i.occupation}>{i.occupation}</td>
              <td key={i.created_at}>
                <p key={"test"}>
                  {i.tags.join(", ")}
                </p>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
