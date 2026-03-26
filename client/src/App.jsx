import { useEffect, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import RemoveShoppingCartRoundedIcon from "@mui/icons-material/RemoveShoppingCartRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { fetchProducts } from "./features/products/productsSlice";
import {
  clearFeedback,
  toggleDrawer,
} from "./features/cart/cartSlice";
import {
  clearCartOnServer,
  removeFromCartOnServer,
  syncCartWithServer,
  syncCartWrite,
  updateCartOnServer,
} from "./features/cart/cartThunks";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

function App() {
  const dispatch = useAppDispatch();
  const { items: products, status: productsStatus, error: productsError } = useAppSelector(
    (state) => state.products
  );
  const cart = useAppSelector((state) => state.cart);
  const [requestError, setRequestError] = useState("");

  const summary = cart.items.reduce(
    (acc, item) => {
      acc.itemCount += item.quantity;
      acc.subtotal += item.price * item.quantity;
      return acc;
    },
    { itemCount: 0, subtotal: 0 }
  );

  const tax = Number((summary.subtotal * 0.1).toFixed(2));
  const shipping = summary.subtotal > 0 && summary.subtotal < 100 ? 12 : 0;
  const total = Number((summary.subtotal + tax + shipping).toFixed(2));

  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchProducts());
    }

    dispatch(syncCartWithServer());
  }, [dispatch, productsStatus]);

  const runCartAction = async (action) => {
    setRequestError("");

    try {
      await dispatch(action).unwrap();
    } catch (error) {
      setRequestError(error || "Request failed");
    }
  };

  return (
    <Box className="hero-shell">
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(31, 29, 23, 0.08)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
                color: "white",
                fontWeight: 800,
              }}
            >
              N
            </Box>
            <Box>
              <Typography variant="h6">Nova Cart</Typography>
              <Typography variant="body2" color="text.secondary">
                Curated goods for work, travel, and everyday carry
              </Typography>
            </Box>
          </Stack>

          <Button
            color="inherit"
            variant="outlined"
            startIcon={<ShoppingBagOutlinedIcon />}
            onClick={() => dispatch(toggleDrawer(true))}
            sx={{ borderColor: "rgba(31, 29, 23, 0.14)" }}
          >
            Cart ({summary.itemCount})
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <span className="eyebrow-pill">Modern essentials, shipped with clarity</span>
              <Typography variant="h1">
                Build a cleaner cart experience without losing backend sync.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 640 }}>
                This storefront pulls products from your Express API, keeps the cart in Redux,
                and syncs each change back to MongoDB by session id.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => dispatch(toggleDrawer(true))}
                >
                  Review cart
                </Button>
                <Chip
                  label={
                    cart.lastSyncedAt
                      ? `Last synced ${new Date(cart.lastSyncedAt).toLocaleTimeString()}`
                      : "Waiting for first cart sync"
                  }
                  sx={{ px: 1, py: 2.6, bgcolor: "rgba(255,255,255,0.72)" }}
                />
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ height: "100%", bgcolor: "background.paper" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="overline" color="primary.main">
                  Order Snapshot
                </Typography>
                <Stack spacing={2} sx={{ mt: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Items</Typography>
                    <Typography fontWeight={700}>{summary.itemCount}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography fontWeight={700}>{formatCurrency(summary.subtotal)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Shipping</Typography>
                    <Typography fontWeight={700}>{formatCurrency(shipping)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Tax</Typography>
                    <Typography fontWeight={700}>{formatCurrency(tax)}</Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">{formatCurrency(total)}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 7 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h2">Featured Inventory</Typography>
              <Typography color="text.secondary">
                Seed the backend, set `VITE_API_BASE_URL`, and this catalog will populate from the
                API.
              </Typography>
            </Box>
            {cart.syncStatus === "loading" && <Chip label="Syncing cart..." color="secondary" />}
          </Stack>

          {productsStatus === "loading" && (
            <Box sx={{ py: 8, display: "grid", placeItems: "center" }}>
              <CircularProgress />
            </Box>
          )}

          {(productsError || requestError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {requestError || productsError}
            </Alert>
          )}

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} lg={4} key={product._id || product.slug}>
                <Card sx={{ height: "100%", overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{ height: 260, objectFit: "cover" }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box sx={{ pr: 2 }}>
                        <Typography variant="h5">{product.name}</Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                          {product.brand} • {product.category}
                        </Typography>
                      </Box>
                      {product.featured && <Chip label="Featured" color="primary" />}
                    </Stack>

                    <Typography color="text.secondary" sx={{ mt: 2, minHeight: 72 }}>
                      {product.description}
                    </Typography>

                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
                      <Typography variant="h6">{formatCurrency(product.price)}</Typography>
                      {product.originalPrice && (
                        <Typography
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          {formatCurrency(product.originalPrice)}
                        </Typography>
                      )}
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5, mb: 2.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Rating {product.rating}/5
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.inventory} in stock
                      </Typography>
                    </Stack>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddShoppingCartRoundedIcon />}
                      onClick={() => runCartAction(syncCartWrite(product))}
                    >
                      Add to cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Drawer
        anchor="right"
        open={cart.isDrawerOpen}
        onClose={() => dispatch(toggleDrawer(false))}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420 },
            p: 3,
            bgcolor: "background.paper",
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h5">Your Cart</Typography>
            <Typography color="text.secondary">{summary.itemCount} item(s)</Typography>
          </Box>
          <Button color="inherit" onClick={() => dispatch(toggleDrawer(false))}>
            Close
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2} sx={{ flex: 1, overflow: "auto" }}>
          {cart.items.length === 0 ? (
            <Alert severity="info">Your cart is empty. Add a product to begin.</Alert>
          ) : (
            cart.items.map((item) => (
              <Card key={item.product} variant="outlined" sx={{ boxShadow: "none" }}>
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{ width: 88, height: 88, borderRadius: 3, objectFit: "cover" }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={700}>{item.name}</Typography>
                      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        {formatCurrency(item.price)} each
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            runCartAction(
                              updateCartOnServer({
                                productId: item.product,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                        >
                          -
                        </Button>
                        <Chip label={`Qty ${item.quantity}`} />
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={item.quantity >= item.inventory}
                          onClick={() =>
                            runCartAction(
                              updateCartOnServer({
                                productId: item.product,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                        >
                          +
                        </Button>
                        <IconButton
                          color="error"
                          onClick={() => runCartAction(removeFromCartOnServer(item.product))}
                        >
                          <DeleteOutlineRoundedIcon />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>

        <Box sx={{ pt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1.2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>{formatCurrency(summary.subtotal)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Shipping</Typography>
              <Typography>{formatCurrency(shipping)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Tax</Typography>
              <Typography>{formatCurrency(tax)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" sx={{ pt: 1 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">{formatCurrency(total)}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
            <Button
              fullWidth
              color="inherit"
              variant="outlined"
              startIcon={<RemoveShoppingCartRoundedIcon />}
              disabled={!cart.items.length}
              onClick={() => runCartAction(clearCartOnServer())}
            >
              Clear
            </Button>
            <Button fullWidth variant="contained" disabled={!cart.items.length}>
              Checkout
            </Button>
          </Stack>
        </Box>
      </Drawer>

      {cart.feedback && (
        <Alert
          severity="success"
          onClose={() => dispatch(clearFeedback())}
          sx={{
            position: "fixed",
            right: 24,
            bottom: 24,
            width: { xs: "calc(100% - 32px)", sm: 360 },
            boxShadow: "0 18px 42px rgba(0,0,0,0.12)",
          }}
        >
          {cart.feedback}
        </Alert>
      )}
    </Box>
  );
}

export default App;
