import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            add_to_cart: "Add to Cart",
            welcome: "Welcome",
            shop: "Shop",
            login: "Login",
            logout: "Logout",
            home: "Home",
            voucher: "Voucher",
            blog: "Blog",
            contact: "Contact",
            login_signup: "Login / Signup",
            voucher_store: "Voucher Store",
            order_history: "Order History",
            account_info: "Account Info",
            loading: "Loading",
            logout_error: "Error while logging out",
            login_to_view_cart: "You need to login to view cart",
            shop_title: "Products",
            shop_subtitle: "Home - Products",
            product_detail_title: "Product Details",
            product_detail_subtitle: "Home - Product Details",
            product_category: "Category",
            contact_price: "Contact for Price",
            product_description: "Description",
            variant_title: "Uses",
            no_variants: "No variants available",
            quantity: "Quantity",
            login_required: "Login Required",
            login_prompt: "Please login to add products to your cart!",
            close: "Close",
            success_add_to_cart: "Product added to cart successfully!",
            error_loading_product: "Failed to load product details",
            no_products: "No products to display",
            previous: "Previous",
            next: "Next",
            variants: "Variants",
            sort_by: "Sort by",
            name_asc: "Name: A to Z",
            name_desc: "Name: Z to A",
            price_asc: "Price: Low to High",
            price_desc: "Price: High to Low",
            search_placeholder: "Search",
            category: "Category",
            brand: "Brand"
        }
    },
    vi: {
        translation: {
            add_to_cart: "Thêm vào giỏ hàng",
            welcome: "Chào mừng",
            shop: "Cửa hàng",
            login: "Đăng nhập",
            logout: "Đăng xuất",
            home: "Trang chủ",
            voucher: "Voucher",
            blog: "Blog",
            contact: "Liên hệ",
            login_signup: "Đăng nhập / Đăng ký",
            voucher_store: "Kho voucher",
            order_history: "Đơn đã đặt",
            account_info: "Thông tin tài khoản",
            loading: "Đang tải",
            logout_error: "Lỗi khi đăng xuất",
            login_to_view_cart: "Bạn cần đăng nhập để xem giỏ hàng",
            shop_title: "Sản phẩm",
            shop_subtitle: "Trang chủ - Sản phẩm",
            product_detail_title: "Chi tiết sản phẩm",
            product_detail_subtitle: "Trang chủ - Chi tiết sản phẩm",
            product_category: "Danh mục",
            contact_price: "Liên hệ",
            product_description: "Mô tả",
            variant_title: "Công dụng",
            no_variants: "Không có biến thể",
            quantity: "Số lượng",
            login_required: "Yêu cầu đăng nhập",
            login_prompt: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!",
            close: "Đóng",
            success_add_to_cart: "Sản phẩm đã được thêm vào giỏ hàng!",
            error_loading_product: "Không thể tải chi tiết sản phẩm",
            no_products: "Không có sản phẩm nào để hiển thị",
            previous: "Trước",
            next: "Tiếp",
            variants: "Tùy chọn",
            sort_by: "Sắp xếp theo",
            name_asc: "Tên: A đến Z",
            name_desc: "Tên: Z đến A",
            price_asc: "Giá: Thấp đến Cao",
            price_desc: "Giá: Cao đến Thấp",
            search_placeholder: "Tìm kiếm",
            category: "Danh mục",
            brand: "Thương hiệu"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;