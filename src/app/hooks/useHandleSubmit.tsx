export const useHandleSubmit = () => {
  const handleSubmit = async () => {
    try {
      const resp = await fetch("/api/authTokenAPI", {
        method: "GET",
      });
      console.log(resp);

      const { url } = await resp.json();
      console.log(resp.status);
      console.log("Handle Submit");

      if (resp.status === 200) {
        return { url, status: 200 };
      } else {
        throw new Error("Failed to fetch authTokenAPI");
      }
    } catch (error) {
      return { error, status: 500 };
    }
  };

  return { handleSubmit };
};
