import { useQuery } from "@tanstack/react-query";

interface Props {
  userid: string;
  tid: number;
}

export const useContents = ({ userid, tid }: Props) => {
  const { data: contents = [] } = useQuery({});
};
