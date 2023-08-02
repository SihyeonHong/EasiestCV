export default function NonAdminHome() {
  const userid = useParams().userid; // useParams()는 {userid: "userid"} 형식의 object
  const [isUserExist, setIsUserExist] = useState(false);
  const navigate = useNavigate();
  const [tabs, setTabs] = useState(["Tab1", "Tab2"]);
  const [activeKey, setActiceKey] = useState("home");
  const [userinfo, setUserinfo] = useState({}); // userinfo = {username: "", email: "", ...}

  const handleLinkToInitPage = () => {
    navigate("/");
  };

  const getTabs = () => {
    axios
      .get(`http://localhost:8080/tabs?userid=${userid}`)
      .then((res) => {
        console.log(res.data);
        // setTabs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/userinfo?userid=${userid}`)
      .then((res) => {
        setIsUserExist(true);
        // console.log(res);
        setUserinfo(res.data);
        // get additional info
        // getTabs();
      })
      .catch((err) => {
        setIsUserExist(false);
        console.log(err);
      });
  }, []);

  return (
    <Container>
      <Row style={{ textAlign: "right" }}>
        <Col>
          <Button variant="dark" onClick={handleLinkToInitPage}>
            Log In | Sign Up
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <h1 className="mt-5 mb-5">
            {userinfo && userinfo.username.toUpperCase()}
          </h1>
        </Col>
      </Row>
      <Row>
        <Nav
          variant="underline"
          className="nav justify-content-center"
          activeKey={activeKey}
        >
          <Nav.Item>
            <Nav.Link
              eventKey="home"
              onClick={() => {
                navigate("/" + userid);
                setActiceKey("home");
              }}
            >
              Home
            </Nav.Link>
          </Nav.Item>
          {tabs &&
            tabs.map((tab, idx) => (
              <Nav.Item key={idx}>
                <Nav.Link
                  eventKey={tab}
                  onClick={() => {
                    setActiceKey(tab);
                    //   navigate(currentPath + "/" + tab);
                  }}
                >
                  {tab}
                </Nav.Link>
              </Nav.Item>
            ))}
          <Nav.Item>
            <Nav.Link disabled>PDF</Nav.Link>
          </Nav.Item>
        </Nav>
      </Row>
      <Row>
        {isUserExist ? (
          activeKey === "home" ? (
            <HomeComponent img={userinfo.img} intro={userinfo.intro} />
          ) : (
            <TabComponent tabname={activeKey} />
          )
        ) : (
          <NoUserComponent />
        )}
      </Row>
    </Container>
  );
}
