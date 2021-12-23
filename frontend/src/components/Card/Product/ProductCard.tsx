import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Grow from "@mui/material/Grow";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

import { Product } from "common/Types";
import axiosBase from "utils/axiosBase";
import { getAuthHeader } from "utils/authHelpers";
import handleResponseError from "utils/handleResponseError";
import { dollarToCredit } from "utils/creditDollarConvertion";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface ProductCardProps extends Product {
  isMerchant?: boolean;
  onDelete?: any;
  onEdit?: any;
}

const ProductCard = ({
  name,
  description,
  picture,
  price,
  category,
  isMerchant,
  onDelete,
  onEdit,
}: ProductCardProps) => {
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);

  useEffect(() => {
    // Required when initial image onLoad does not fire
    setTimeout(() => setLoaded(true), 300);
  }, []);

  const closeDeleteDialog = () => setDeleteDialogOpen(false);
  const openDeleteDialog = () => setDeleteDialogOpen(true);

  const closePurchaseDialog = () => setPurchaseDialogOpen(false);
  const openPurchaseDialog = () => setPurchaseDialogOpen(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleBuy = () => {
    axiosBase
      .post(
        "/payment/purchase",
        {
          name: name,
        },
        getAuthHeader()
      )
      .then((response) => toast.success(response.data.message))
      .catch(({ response }) => handleResponseError(response));
  };

  return (
    <>
      <Dialog open={purchaseDialogOpen} onClose={closePurchaseDialog}>
        <DialogTitle>Purchase product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to buy "{name}" for {dollarToCredit(price)} CR?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePurchaseDialog}>Cancel</Button>
          <Button
            onClick={() => {
              closePurchaseDialog();
              handleBuy();
            }}
            color="success"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Permanently delete product "{name}"? You can't undo this.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button
            onClick={() => {
              closeDeleteDialog();
              onDelete(name);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Grow in={loaded}>
        <Card>
          <Avatar
            src={picture}
            variant="square"
            sx={{ height: 200, width: "100%" }}
            alt={name}
          />
          <CardContent>
            <Typography variant="h5">{name}</Typography>
            <Typography gutterBottom variant="body2">
              {category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isMerchant ? `$${price}` : `${dollarToCredit(price)} credits`}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            {isMerchant ? (
              <>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ mr: 1 }}
                  onClick={() => onEdit(name)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={openDeleteDialog}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button
                size="small"
                variant="contained"
                onClick={openPurchaseDialog}
              >
                Buy
              </Button>
            )}
            <ExpandMore expand={expanded} onClick={handleExpandClick}>
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>{description}</Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Grow>
    </>
  );
};

export default ProductCard;
