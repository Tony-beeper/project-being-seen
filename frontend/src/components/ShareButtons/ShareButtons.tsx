import { useState } from "react";

import {
  EmailShareButton,
  RedditShareButton,
  TwitterShareButton,
  WeiboShareButton,
  WhatsappShareButton,
  EmailIcon,
  TwitterIcon,
  RedditIcon,
  WeiboIcon,
  WhatsappIcon,
} from "react-share";

import Fab from "@mui/material/Fab";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ShareIcon from "@mui/icons-material/Share";
import Box from "@mui/material/Box";

import styles from "./ShareButton.module.scss";

interface ShareButtonsProps {
  shareUrl: string;
}

const ShareButtons = ({ shareUrl }: ShareButtonsProps) => {
  const [open, setOpen] = useState(false);
  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);
  const DefaultMessage =
    "Check out my BeingSeen profile! You can find it here: ";
  const DefaultMessageForReddit =
    "Check out my BeingSeen profile! You can find it in this post! ";

  return (
    <>
      <Dialog onClose={closeDialog} open={open} maxWidth="sm" fullWidth>
        <Typography align="center" variant="h5" mt={5}>
          Share my profile
        </Typography>
        <Box my={5} px={2} className={styles.buttonContainer}>
          <Button component="span" color="inherit">
            <TwitterShareButton url={shareUrl} title={DefaultMessage}>
              <TwitterIcon size={50} round />
              <Typography>Twitter</Typography>
            </TwitterShareButton>
          </Button>
          <Button component="span" color="inherit">
            <RedditShareButton url={shareUrl} title={DefaultMessageForReddit}>
              <RedditIcon size={50} round />
              <Typography>Reddit</Typography>
            </RedditShareButton>
          </Button>
          <Button component="span" color="inherit">
            <WeiboShareButton url={shareUrl} title={DefaultMessage}>
              <WeiboIcon size={50} round />
              <Typography>Weibo</Typography>
            </WeiboShareButton>
          </Button>
          <Button component="span" color="inherit">
            <WhatsappShareButton url={shareUrl} title={DefaultMessage}>
              <WhatsappIcon size={50} round />
              <Typography>WhatsApp</Typography>
            </WhatsappShareButton>
          </Button>
          <Button component="span" color="inherit">
            <EmailShareButton url={shareUrl} body={DefaultMessage}>
              <EmailIcon size={50} round />
              <Typography>Email</Typography>
            </EmailShareButton>
          </Button>
        </Box>
      </Dialog>
      <Tooltip title="Share" placement="left">
        <Fab
          color="primary"
          onClick={openDialog}
          className={styles.shareButton}
        >
          <ShareIcon />
        </Fab>
      </Tooltip>
    </>
  );
};

export default ShareButtons;
