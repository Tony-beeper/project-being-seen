import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Grow from "@mui/material/Grow";

import { PublicYouth } from "common/Types";
import styles from "./YouthCard.module.scss";

// Renders a clickable card displaying a short preview of the youth
const YouthCard = ({
  name,
  story,
  username,
  profilePicture,
  dateOfBirth,
}: PublicYouth) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Required when initial image onLoad does not fire
    setTimeout(() => setLoaded(true), 300);
  }, []);

  return (
    <Link to={`/u/${username}`} className={styles.linkOverrides}>
      <Grow in={loaded}>
        <Card>
          <CardActionArea>
            <Avatar
              src={profilePicture}
              variant="square"
              sx={{ height: 200, width: "100%" }}
              imgProps={{
                onLoad: () => setLoaded(true),
                onError: () => setLoaded(true),
              }}
            />
            <CardContent>
              <Typography variant="h6">
                {name} ({moment().diff(dateOfBirth, "years")})
              </Typography>
              <Typography variant="body2" color="primary">
                @{username}
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                className={styles.lineOverflow}
              >
                {story}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grow>
    </Link>
  );
};

export default YouthCard;
