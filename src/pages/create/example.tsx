export type ExampleProps = {
  data: any;
};

const example = ({ data }: ExampleProps) => {
  return (
    <div>
      <h1>Data from getServer side props</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default example;

export async function getServerSideProps() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = await response.json();

  return { props: { data } };
}
