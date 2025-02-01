import { useQuery } from "@apollo/client";
import { TEST_QUERY } from "./queries";

export default function Funnel() {
  const { data, loading, error } = useQuery(TEST_QUERY);
  console.log({ data, loading, error });
  return (
    <div>
      <h2>Business Data</h2>
      <ul>
        {data?.businesses?.map((biz, index) => (
          <li key={index}>
            <strong>Description:</strong> {biz.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
