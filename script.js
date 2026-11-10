(async () => {
			const STORAGE_KEY = "brewing-point-coffee-shop-v1";
			const slug = (value) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
			const menuProducts = [];
			function addMenuItems(category, names, prices, sizes = []) {
				names.forEach((name, itemIndex) => {
					const variants = sizes.length
						? prices.map((price, priceIndex) => ({ price, size: sizes[priceIndex] }))
						: [{ price: prices.length === names.length ? prices[itemIndex] : prices[0], size: "" }];
					variants.forEach(({ price, size }) => {
						const label = `${name}${size ? ` (${size})` : ""}`;
						menuProducts.push({
							id: slug(`${category}-${label}`),
							name: label,
							category,
							price
						});
					});
				});
			}

			addMenuItems("Milk Tea", [
				"Wintermelon", "Dark Chocolate", "Salted Caramel", "Taro", "Red Velvet", "Matcha", "Cookies & Cream", "Choco Strawberry"
			], [45, 55], ["M", "L"]);
			addMenuItems("Cheesecake", ["Cheesecake"], [60, 70], ["M", "L"]);
			addMenuItems("Cold Brew", [
				"Caramel Macchiato", "Mocha Latte", "French Vanilla", "Salted Caramel", "Iced Chocolate", "Tres Leches", "Iced Americano", "Dirty Matcha", "Biscoff"
			], [60, 70], ["M", "L"]);
			addMenuItems("Hot Brew", ["Hot Brew (12 oz.)"], [55]);
			addMenuItems("Fruit Tea", ["Fruit Tea"], [50, 60], ["M", "L"]);
			addMenuItems("Soda Fizz", ["Strawberry", "Blueberry", "Lemon", "Lychee", "Green Apple", "Mango"], [55, 65], ["M", "L"]);
			addMenuItems("Milk Series", [
				"Fruit Milk: Strawberries & Milk", "Fruit Milk: Blueberries & Milk", "Fruit Milk: Mango & Milk",
				"Latte Series: Ube Matcha Latte", "Latte Series: Ube Latte", "Latte Series: Matcha Latte",
				"Others: Avocado", "Others: Pistachio"
			], [60, 70], ["M", "L"]);
			addMenuItems("Frappe", [
				"Coffee Based: Java Chip", "Coffee Based: Dark Mocha", "Coffee Based: Dark Caramel",
				"Non-Coffee: Strawberries & Cream", "Non-Coffee: Blueberries & Cream", "Non-Coffee: Salted Caramel",
				"Non-Coffee: Matcha", "Non-Coffee: Dark Choco Berry", "Non-Coffee: Triple Chocolate",
				"Non-Coffee: Double Oreo", "Non-Coffee: Avocado"
			], [60, 70], ["M", "L"]);
			addMenuItems("Signature Drinks", [
				"Avocado Cream Cheese", "Biscoff", "Almond Pistachio", "Dark Choco Lava", "Almond Matcha",
				"Kopi Caramel", "Dark Forest", "Matcha Strawberry", "Red Velvet Cream Cheese",
				"Oreo Cream Cheese", "Dark Choco Cream Cheese", "Strawberry Cream Cheese",
				"Blueberry Cream Cheese", "Mango Cream Cheese", "Ube Cream Cheese"
			], [120], ["Large"]);
			addMenuItems("Add-ons", [
				"Pearl", "Nata", "Coffee Jelly", "Whipped Cream", "Crushed Oreo", "Cheesecake", "Coffee Shot"
			], [10, 10, 15, 10, 10, 15, 10]);
			addMenuItems("Siomai", ["Pork Shanghai (5 pcs.)", "Beef (5 pcs.)"], [50]);
			addMenuItems("Burgers", ["Classic Burger", "Burger with Veggies & Cheese"], [45, 55]);
			addMenuItems("Hotdogs", ["Classic Hotdog", "Overload Hotdog"], [50, 60]);
			addMenuItems("French Fries", ["French Fries - Butter Cheese", "French Fries - Sour Cream & Onion", "French Fries - BBQ"], [50]);
			addMenuItems("Snack Combos", [
				"C1: Classic Burger + Medium Milk Tea", "C2: Classic Burger + Large Milk Tea",
				"C3: Burger w/ Veg Cheese + Medium Milk Tea", "C4: Burger w/ Veg Cheese + Large Milk Tea",
				"C5: Classic Hotdog + Medium Milk Tea", "C6: Classic Hotdog + Large Milk Tea",
				"C7: Overload Hotdog + Medium Milk Tea", "C8: Overload Hotdog + Large Milk Tea"
			], [85, 95, 95, 99, 85, 95, 95, 99]);

			const menuProductIds = new Set(menuProducts.map((item) => item.id));
			if (menuProductIds.size !== menuProducts.length) {
				throw new Error("The menu contains duplicate product IDs.");
			}
			const materialCatalog = [];
			function addMaterials(category, names, unit = "piece", groups = {}) {
				names.forEach((name) => {
					const id = slug(`${category}-${name}`);
					materialCatalog.push({ id, name, category, unit, groups: groups[name] || [], stock: 0, threshold: 0, expiresOn: "", setupRequired: true });
				});
			}
			addMaterials("OTHERS", ["Non dairy creamer", "Fructose can", "Boba pearls", "Milin"], "kg");
			addMaterials("MISC", ["Sales pad", "Dishwashing liquid"]);
			addMaterials("LCC", ["NESCAFE - CLASSIC", "Evap milk", "Condensed milk"]);
			addMaterials("LEKYAN", ["SPRITE"], "bottle");
			addMaterials("SHOPEE", ["12 oz Coffee cups w/ lid", "Crushed cookies", "Benny Casa Black Tea", "Coffee Jelly", "Sealing film", "Trash bag xlarge"]);
			addMaterials("FRUIT TEA SYRUPS", [
				"Milin - Strawberry syrup", "Milin - Blueberry syrup", "Milin - Lychee syrup",
				"Milin - Lemon syrup", "Milin - Green Apple syrup", "Milin - Kiwi syrup",
				"Milin - Mango syrup", "Milin - Passion fruit syrup", "Milin - Peppermint syrup"
			], "kg");
			addMaterials("JAMS", ["Dokking - Strawberry Jam", "Dokking - Blueberry Jam", "Dokking - Mango Jam"], "kg");
			addMaterials("POWDERS", [
				"INJOY MILKSHAKE - CHOCO HOT FUDGE", "EASY - DARK CHOCOLATE BASE", "INJOY MILKSHAKE - STRAWBERRY",
				"PRIMERA - MATCHA", "INJOY MILKTEA - MATCHA", "INJOY MILKTEA - WINTERMELON",
				"INJOY MILKTEA - OKINAWA", "ARTISANAL MILKTEA - RED VELVET", "INJOY MILKSHAKE - TARO",
				"INJOY MILKSHAKE - COOKIES & CREAM", "INJOY MILKSHAKE - VANILLA", "INJOY MILKSHAKE - BLACK FOREST",
				"INJOY MILKSHAKE - MOCHA", "INJOY MILKSHAKE - UBE", "FRENCH VANILLA POWDER",
				"PRIMERA - JAVA CHIP", "TOP CREAMERY - SALTED CARAMEL", "TOP CREAMERY - CHEESECAKE BASE (for prem frp)",
				"EASY - DARK CHOCOLATE BASE (for frappe)", "EASY - FRAPPE/CREAM BASE (for frappe)", "EASY - WHIPPED CREAM POWDER",
				"EASY - CREAM CHEESE (for walling)", "EASY - MILK ESSENCE"
			], "pack", {
				"INJOY MILKSHAKE - CHOCO HOT FUDGE": ["FOR MT-DC (1:1)", "FOR MT-CS (1:1)"],
				"EASY - DARK CHOCOLATE BASE": ["FOR MT-DC (1:1)"],
				"INJOY MILKSHAKE - STRAWBERRY": ["FOR MT-CS (1:1)"],
				"PRIMERA - MATCHA": ["FOR MT-M (1:2)"]
			});
			addMaterials("BARS", ["Dutch choco bar", "Ube bar", "Sliced almonds"]);
			addMaterials("SYRUP", [
				"Easy or ACC - Caramel Syrup", "Easy or ACC - Chocolate Syrup", "Ube Syrup", "Easy - White Chocolate Syrup"
			], "bottle");
			addMaterials("PLASTIC & STRAWS", [
				"Mini plastic", "Tiny plastic", "Medium plastic", "Boba straw", "Thin straw",
				"16 oz cups", "22 oz cups", "95mm Dome lid", "95mm Flat lid"
			]);
			const legacyMaterialIdMap = {
				[slug("OTHERS-Non dairy creamer 25 kg")]: slug("OTHERS-Non dairy creamer"),
				[slug("OTHERS-Fructose can 25kg")]: slug("OTHERS-Fructose can"),
				[slug("OTHERS-Milin - Nata de coco 2.5kg")]: slug("OTHERS-Milin"),
				[slug("LEKYAN-SPRITE 1.5 LITER")]: slug("LEKYAN-SPRITE"),
				[slug("FRUIT TEA SYRUPS-Milin - Strawberry syrup 2.5kg")]: slug("FRUIT TEA SYRUPS-Milin - Strawberry syrup"),
				[slug("FRUIT TEA SYRUPS-Milin - Blueberry syrup 2.5kg")]: slug("FRUIT TEA SYRUPS-Milin - Blueberry syrup"),
				[slug("FRUIT TEA SYRUPS-Milin - Lychee syrup 2.5kg")]: slug("FRUIT TEA SYRUPS-Milin - Lychee syrup"),
				[slug("FRUIT TEA SYRUPS-Milin - Lemon syrup 2.5kg")]: slug("FRUIT TEA SYRUPS-Milin - Lemon syrup"),
				[slug("FRUIT TEA SYRUPS-Milin - Green Apple syrup 2.5kg")]: slug("FRUIT TEA SYRUPS-Milin - Green Apple syrup"),
				[slug("FRUIT TEA SYRUPS-Milin - Kiwi syrup 2.5kg")]: slug("FRUIT TEA SYRUPS-Milin - Kiwi syrup"),
				[slug("FRUIT TEA SYRUPS-Milin - Mango syrup 2.5kg")]: slug("FRUIT TEA SYRUPS-Milin - Mango syrup"),
				[slug("FRUIT TEA SYRUPS-Milin - Passion fruit syrup 2.5kg")]: slug("FRUIT TEA SYRUPS-Milin - Passion fruit syrup"),
				[slug("FRUIT TEA SYRUPS-Milin - Peppermint syrup 2.5kg")]: slug("FRUIT TEA SYRUPS-Milin - Peppermint syrup"),
				[slug("JAMS-Dokking - Strawberry Jam 3kg")]: slug("JAMS-Dokking - Strawberry Jam"),
				[slug("JAMS-Dokking - Blueberry Jam 3kg")]: slug("JAMS-Dokking - Blueberry Jam"),
				[slug("JAMS-Dokking - Mango Jam 3kg")]: slug("JAMS-Dokking - Mango Jam"),
				[slug("HOTDOG-Taiyaki Box")]: slug("HOTDOG-Takoyaki Box")
			};
			function addSuppliedMaterials(category, materials) {
				materials.forEach(({ name, supplier = "", brand = "", stock = 0, unit = "piece", setupRequired = false }) => {
					const id = slug(`${category}-${name}`);
					materialCatalog.push({ id, name, category, supplier, brand, unit, stock, threshold: 0, expiresOn: "", setupRequired });
				});
			}
			addSuppliedMaterials("SIOMAI", [
				{ name: "Shanghai Siomai", supplier: "Siomai King Legazpi", brand: "Siomai King", stock: 1, unit: "PK / 40 PCS" },
				{ name: "Chicken Siomai", supplier: "Siomai King Legazpi", brand: "Siomai King", stock: 1, unit: "PK / 40 PCS" },
				{ name: "Japanese Siomai", supplier: "Siomai King Legazpi", brand: "Siomai King", stock: 1, unit: "PK / 40 PCS" },
				{ name: "Chili Garlic Sauce", stock: 1, unit: "PK / 400 Grams" },
				{ name: "Kikiam Plate", supplier: "Unitex", brand: "Silver", stock: 1, unit: "PK / 50 PCS" },
				{ name: "Tooth Pick", supplier: "Unitex", stock: 1, unit: "PK / 1000 PCS" },
				{ name: "Soy Sauce", supplier: "Bake & Resto", brand: "Uno Soy Sauce", stock: 1, unit: "Liter" }
			]);
			addSuppliedMaterials("SIOPAO", [
				{ name: "Asado Siopao", supplier: "Siomai King Legazpi", brand: "Siomai King", stock: 1, unit: "PK / 6 PCS" },
				{ name: "Bola Bola Siopao", supplier: "Siomai King Legazpi", brand: "Siomai King", stock: 1, unit: "PK / 6 PCS" },
				{ name: "Free Sauce", unit: "portion", setupRequired: true },
				{ name: "Siopao Wrapper", supplier: "Unitex", brand: "Plain White", stock: 1, unit: "PK / 100 PCS" }
			]);
			addSuppliedMaterials("BURGER", [
				{ name: "Burger Patty", supplier: "Pampanga's Best - Camalig", brand: "Pampanga's Best Meaty Burger", stock: 1, unit: "Box / 80 PCS" },
				{ name: "Burger Wrapper", supplier: "Unitex", stock: 1, unit: "PK / 100 PCS" },
				{ name: "Burger Bun", supplier: "Meranel's Bakeshop Legazpi", stock: 1, unit: "PK / 10 PCS" }
			]);
			addSuppliedMaterials("HOTDOG", [
				{ name: "Hotdog", supplier: "Nong's Legazpi", brand: "TJ Jumbo Hotdog", stock: 1, unit: "PK / 60 PCS" },
				{ name: "Hotdog Wrapper", supplier: "Unitex", stock: 1, unit: "PK / 100 PCS" },
				{ name: "Takoyaki Box", supplier: "Unitex", brand: "Plain White", stock: 1, unit: "PK / 25 PCS" },
				{ name: "Hotdog Bun", supplier: "Meranel's Bakeshop Legazpi", stock: 1, unit: "PK / 10 PCS" }
			]);
			addSuppliedMaterials("CONDIMENTS FOR BURGER & HOTDOG, FRIES", [
				{ name: "Burger Sauce (Mayo/Dressing)", supplier: "Peacock", brand: "Mike's Dressing (Mayo Ketchup)", stock: 1, unit: "Gal" },
				{ name: "Cheese", supplier: "Peacock", brand: "Quezo / Bigtime", stock: 1, unit: "Big" },
				{ name: "Refill Oil", supplier: "Peacock", brand: "Plastic Oil", stock: 1, unit: "KG" },
				{ name: "Cabbage", supplier: "Albay Public Market", stock: 1, unit: "KG" },
				{ name: "Grease Paper", supplier: "Unitex", setupRequired: true }
			]);
			addSuppliedMaterials("FRIES", [
				{ name: "Fries (Medium Size)", supplier: "Peacock", brand: "Hungritos", unit: "portion", setupRequired: true },
				{ name: "Fries (Large Size)", supplier: "Peacock", brand: "Hungritos", unit: "portion", setupRequired: true },
				{ name: "220 CC Cup", supplier: "Peacock", stock: 1, unit: "PK / 50 PCS" },
				{ name: "260 CC Cup", supplier: "Peacock", stock: 1, unit: "PK / 50 PCS" },
				{ name: "Cheese Powder", supplier: "Peacock", brand: "ACL Cheesemiss", stock: 1, unit: "PK / 200 G" },
				{ name: "Sour & Cream Powder", supplier: "Peacock", brand: "ACL Rancheros", stock: 1, unit: "PK / 200 G" },
				{ name: "BBQ Powder", supplier: "Peacock", brand: "ACL Rancheros", stock: 1, unit: "PK / 200 G" }
			]);
			const previousMenuIds = new Set([
				"espresso", "americano", "cappuccino", "latte", "flat-white",
				"cold-brew", "matcha", "lemon-tea", "croissant"
			]);
			const initialState = { products: menuProducts, materials: materialCatalog, recipes: {}, sales: [], archivedProducts: [] };
			let state;
			try {
				const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
				if (saved && Array.isArray(saved.products) && Array.isArray(saved.sales)) {
					const savedProducts = new Map(saved.products.map((item) => [item.id, item]));
					const deletedProductIds = Array.isArray(saved.deletedProductIds) ? saved.deletedProductIds.filter((id) => typeof id === "string") : [];
					const archivedProducts = Array.isArray(saved.archivedProducts) ? saved.archivedProducts : [];
					const archivedIds = new Set(archivedProducts.map((item) => item.id));
					const legacyArchivedProducts = deletedProductIds
						.filter((id) => !archivedIds.has(id))
						.map((id) => menuProducts.find((item) => item.id === id))
						.filter(Boolean)
						.map((item) => ({ ...item, archivedAt: new Date().toISOString() }));
					const allArchivedProducts = [...archivedProducts, ...legacyArchivedProducts];
					const deletedMenuIds = new Set(allArchivedProducts.filter((item) => menuProductIds.has(item.id)).map((item) => item.id));
					const currentMenu = menuProducts.filter((item) => !deletedMenuIds.has(item.id)).map((item) => {
						const previous = savedProducts.get(item.id);
						if (!previous) return item;
						const { stock, threshold, expiresOn, ...savedProduct } = previous;
						return { ...item, ...savedProduct, id: item.id };
					});
					const customProducts = saved.products
						.filter((item) => !previousMenuIds.has(item.id) && !menuProductIds.has(item.id))
						.map(({ stock, threshold, expiresOn, ...item }) => item);
					const savedMaterials = Array.isArray(saved.materials) ? saved.materials : [];
					const savedMaterialsById = new Map(savedMaterials.map((item) => [item.id, item]));
					const materials = [
						...materialCatalog.map((item) => {
							const previous = savedMaterialsById.get(item.id) ||
								savedMaterials.find((savedItem) => legacyMaterialIdMap[savedItem.id] === item.id);
							return previous ? {
								...item,
								...previous,
								name: previous.id === item.id ? String(previous.name || item.name) : item.name,
								category: previous.id === item.id ? String(previous.category || item.category) : item.category,
								unit: String(previous.unit || item.unit),
								supplier: String(previous.supplier || item.supplier || ""),
								brand: String(previous.brand || item.brand || ""),
								groups: item.groups,
								stock: Number.isFinite(Number(previous.stock)) ? Number(previous.stock) : 0,
								threshold: Number.isFinite(Number(previous.threshold)) ? Number(previous.threshold) : 0,
								setupRequired: typeof previous.setupRequired === "boolean" ? previous.setupRequired : false
							} : item;
						}),
						...savedMaterials
							.filter((item) =>
								!materialCatalog.some((catalogItem) => catalogItem.id === item.id) &&
								!Object.prototype.hasOwnProperty.call(legacyMaterialIdMap, item.id)
							)
							.map((item) => ({
								...item,
								unit: String(item.unit || "piece"),
								supplier: String(item.supplier || ""),
								brand: String(item.brand || ""),
								stock: Number.isFinite(Number(item.stock)) ? Number(item.stock) : 0,
								threshold: Number.isFinite(Number(item.threshold)) ? Number(item.threshold) : 0,
								setupRequired: typeof item.setupRequired === "boolean" ? item.setupRequired : false
							}))
					];
					const materialIds = new Set(materials.map((item) => item.id));
					const savedRecipes = saved.recipes && typeof saved.recipes === "object" ? saved.recipes : {};
					const recipes = Object.fromEntries(Object.entries(savedRecipes).map(([productId, recipe]) => [
						productId,
						Array.isArray(recipe) ? recipe.filter((ingredient) =>
							ingredient && materialIds.has(ingredient.materialId) && Number.isFinite(Number(ingredient.quantity)) && Number(ingredient.quantity) > 0
						).map((ingredient) => ({ materialId: ingredient.materialId, quantity: Number(ingredient.quantity) })) : []
					]));
					state = { products: [...currentMenu, ...customProducts], materials, recipes, sales: saved.sales, archivedProducts: allArchivedProducts };
				} else {
					state = initialState;
				}
			} catch {
				state = initialState;
			}
			let cart = [];
			let activeCategory = "All";
			let restockId = null;
			let editingProductId = null;
			let editingMaterialId = null;
			let selectedRecipeProductId = "";
			let pendingDeleteProductId = null;
			let pendingDeleteFromArchive = false;
			let toastTimer;

			const byId = (id) => document.getElementById(id);
			const money = (amount) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(Number(amount));
			const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
			let databaseSaveQueue = Promise.resolve();
			let databaseVersion = 0;
			let databaseQueueGeneration = 0;
			let pendingDatabaseSaves = 0;
			let refreshingDatabaseState = false;
			const setDatabaseStatus = (connected) => {
				byId("database-status").textContent = connected ? "Database connected" : "Database disconnected";
				byId("database-status-dot").classList.toggle("offline", !connected);
			};
			const renderCurrentState = () => {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
				renderOverview();
				renderPos();
				renderInventory();
				renderMenuCatalog();
				renderRecipeEditor();
				renderSales();
				renderAnalytics();
				renderStockReport();
				renderArchive();
			};
			const persist = () => {
				const payload = JSON.stringify(state);
				const generation = databaseQueueGeneration;
				let saved = false;
				pendingDatabaseSaves += 1;
				localStorage.setItem(STORAGE_KEY, payload);
				databaseSaveQueue = databaseSaveQueue.then(async () => {
					if (generation !== databaseQueueGeneration) return;
					const requestState = JSON.parse(payload);
					requestState.version = databaseVersion;
					const response = await fetch("state.php", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(requestState)
					});
					const result = await response.json();
					if (response.status === 409) {
						databaseQueueGeneration += 1;
						refreshingDatabaseState = true;
						try {
							const latestResponse = await fetch("state.php");
							const latest = await latestResponse.json();
							if (!latestResponse.ok || !latest.success || !latest.state) {
								throw new Error(latest.message || "Could not reload the latest shop data.");
							}
							state = latest.state;
							databaseVersion = latest.version;
							renderCurrentState();
							showToast("Shop data changed in another session. The latest data was loaded; please retry your change.", "warning");
						} finally {
							refreshingDatabaseState = false;
						}
						return;
					}
					if (!response.ok || !result.success) {
						throw new Error(result.message || "Database save failed.");
					}
					databaseVersion = result.version;
					saved = true;
					setDatabaseStatus(true);
				}).catch((error) => {
					console.error(error);
					setDatabaseStatus(false);
					showToast(`Database save failed: ${error.message}`, "warning");
				}).finally(() => {
					pendingDatabaseSaves = Math.max(0, pendingDatabaseSaves - 1);
				});
				return databaseSaveQueue.then(() => saved);
			};
			const lowItems = () => state.materials.filter((item) => !item.setupRequired && Number(item.stock) <= Number(item.threshold));
			const formatDate = (date) => new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(date);
			const formatTime = (value) => new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
			const saleUnits = (sale) => sale.items.reduce((sum, item) => sum + item.quantity, 0);

			let loginRole = "staff";
			byId("top-date").textContent = formatDate(new Date());
			byId("sidebar-date").textContent = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date());
			renderStockNotifications();

			byId("notification-button").addEventListener("click", () => {
				const panel = byId("notification-panel");
				const willOpen = panel.hidden;
				panel.hidden = !willOpen;
				byId("notification-button").setAttribute("aria-expanded", String(willOpen));
			});
			byId("notification-inventory-button").addEventListener("click", () => {
				byId("notification-panel").hidden = true;
				byId("notification-button").setAttribute("aria-expanded", "false");
				navigate("inventory");
			});
			document.addEventListener("click", (event) => {
				if (!event.target.closest(".notification-wrap")) {
					byId("notification-panel").hidden = true;
					byId("notification-button").setAttribute("aria-expanded", "false");
				}
			});
			document.addEventListener("keydown", (event) => {
				if (event.key === "Escape") {
					byId("notification-panel").hidden = true;
					byId("notification-button").setAttribute("aria-expanded", "false");
				}
			});

			function renderStockNotifications() {
				if (!state) return;
				const items = lowItems();
				const count = byId("notification-count");
				count.textContent = items.length > 99 ? "99+" : String(items.length);
				count.hidden = items.length === 0;
				byId("notification-button").setAttribute(
					"aria-label",
					items.length ? `${items.length} low-stock notification${items.length === 1 ? "" : "s"}` : "No low-stock notifications"
				);
				byId("notification-summary").textContent = `${items.length} low-stock ${items.length === 1 ? "item" : "items"}`;
				byId("notification-list").innerHTML = items.length
					? items.map((item) => `<button class="notification-item" type="button" data-notification-material="${escapeHtml(item.id)}"><span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.category)} · reorder at ${item.threshold} ${escapeHtml(item.unit)}</small></span><span class="notification-stock">${item.stock} ${escapeHtml(item.unit)} left</span></button>`).join("")
					: `<div class="notification-empty">All materials are above their reorder level.</div>`;
			}

			function openShop(displayName, role = "staff") {
				byId("login-screen").hidden = true;
				byId("app-shell").hidden = false;
				byId("app-shell").classList.toggle("staff-workspace", role === "staff");
				const navigation = role === "staff"
					? [
						["overview", "◫", "Dashboard"],
						["inventory", "▤", "INVENTORY"],
						["pos", "＋", "POS"],
						["sales", "↗", "SALES REPORT"],
						["analytics", "▥", "ANALYTICS"],
						["stock-report", "▥", "STOCK REPORT"]
					]
					: [
						["overview", "◫", "Dashboard"],
						["inventory", "▤", "INVENTORY"],
						["pos", "＋", "POS"],
						["sales", "↗", "SALES REPORT"],
						["analytics", "▥", "ANALYTICS"],
						["stock-report", "▥", "STOCK REPORT"],
						["archive", "▣", "ARCHIVE"]
					];
				byId("main-navigation").innerHTML = navigation
					.map(([view, icon, label], index) => `<button class="nav-button ${index === 0 ? "active" : ""}" data-view="${view}"><span class="nav-icon">${icon}</span>${label}</button>`)
					.join("");
				byId("nav-label").textContent = role === "staff" ? "Staff workspace" : "Admin workspace";
				byId("add-material-button").hidden = role !== "admin";
				byId("add-product-button").hidden = role !== "admin";
				byId("menu-catalog-panel").hidden = role !== "admin";
				byId("recipe-panel").hidden = role !== "admin";
				renderRecipeEditor();
				renderMenuCatalog();
				const initials = role === "admin"
					? "AD"
					: displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("") || "BP";
				byId("staff-avatar").textContent = initials;
				byId("staff-avatar").setAttribute("aria-label", `Signed in as ${role}: ${displayName}`);
				renderOverview();
			}

			const signedInName = sessionStorage.getItem("bp-login-name") || sessionStorage.getItem("bp-staff-name");
			const signedInRole = sessionStorage.getItem("bp-login-role") || "staff";
			if (signedInName) {
				try {
					const response = await fetch("state.php");
					const result = await response.json();
					if (!response.ok || !result.success) {
						throw new Error(result.message || "Could not load saved shop data.");
					}
					if (result.state) state = result.state;
					databaseVersion = result.version;
					setDatabaseStatus(true);
					localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
					openShop(signedInName, signedInRole);
					showLowStockAlert(lowItems());
					await persist();
				} catch (error) {
					console.error(error);
					sessionStorage.removeItem("bp-login-name");
					sessionStorage.removeItem("bp-login-role");
					sessionStorage.removeItem("bp-staff-name");
					setDatabaseStatus(false);
					showToast(`Please sign in again: ${error.message}`, "warning");
				}
			}
			window.setInterval(async () => {
				if (!sessionStorage.getItem("bp-login-role") ||
					byId("app-shell").hidden ||
					pendingDatabaseSaves > 0 ||
					refreshingDatabaseState) return;

				try {
					const response = await fetch("state.php");
					const result = await response.json();
					if (!response.ok || !result.success) {
						throw new Error(result.message || "Database connection lost.");
					}
					setDatabaseStatus(true);
					if (result.version > databaseVersion && result.state) {
						state = result.state;
						databaseVersion = result.version;
						renderCurrentState();
						showToast("Shop data updated from another session.");
					}
				} catch (error) {
					setDatabaseStatus(false);
					console.error(error);
				}
			}, 3000);
			document.querySelectorAll("[data-auth-page]").forEach((button) => {
				button.addEventListener("click", () => {
					const page = button.dataset.authPage;
					document.querySelectorAll(".auth-page").forEach((authPage) => {
						authPage.hidden = authPage.id !== `${page}-page`;
					});
					byId(`${page}-title`).focus();
				});
			});
			document.querySelectorAll("[data-login-role]").forEach((button) => {
				button.addEventListener("click", () => {
					loginRole = button.dataset.loginRole;
					document.querySelectorAll("[data-login-role]").forEach((roleButton) => {
						const selected = roleButton === button;
						roleButton.classList.toggle("active", selected);
						roleButton.setAttribute("aria-pressed", String(selected));
					});
					document.querySelectorAll("[data-login-form]").forEach((form) => {
						form.hidden = form.dataset.loginForm !== loginRole;
					});
					byId("login-eyebrow").textContent = loginRole === "admin" ? "Admin access" : "Staff access";
					byId("login-description").textContent = loginRole === "admin"
						? "Enter your admin account email and password to open the admin desk."
						: "Enter your account email and password to open the shop desk.";
				});
			});
			document.querySelectorAll("[data-login-form]").forEach((form) => {
				form.addEventListener("submit", async (event) => {
					event.preventDefault();
					if (!form.reportValidity()) return;
					const values = new FormData(form);
					const submitButton = form.querySelector('[type="submit"]');
					submitButton.disabled = true;
					try {
						const response = await fetch("login.php", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								email: String(values.get("email")).trim(),
								password: String(values.get("password")),
								role: form.dataset.loginForm
							})
						});
						const result = await response.json();
						if (!response.ok || !result.success) {
							throw new Error(result.message || "Sign-in failed.");
						}
						databaseVersion = result.version;
						if (result.state) {
							state = result.state;
							localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
						}
						setDatabaseStatus(true);
						sessionStorage.setItem("bp-login-name", result.fullname);
						sessionStorage.setItem("bp-login-role", result.role);
						sessionStorage.setItem("bp-staff-name", result.fullname);
						openShop(result.fullname, result.role);
						showLowStockAlert(lowItems());
						await persist();
					} catch (error) {
						console.error(error);
						showToast(error.message || "Could not connect to the server.", "warning");
					} finally {
						submitButton.disabled = false;
					}
				});
			});
			const registerPassword = byId("register-password");
			const registerPasswordConfirm = byId("register-password-confirm");
			registerPasswordConfirm.addEventListener("input", () => {
				registerPasswordConfirm.setCustomValidity(
					registerPasswordConfirm.value === registerPassword.value ? "" : "Passwords do not match."
				);
			});
			registerPassword.addEventListener("input", () => {
				registerPasswordConfirm.dispatchEvent(new Event("input"));
			});
			byId("register-form").addEventListener("submit", async (event) => {

    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const data = new FormData();

    data.append(
        "fullname",
        form.registerName.value
    );

    data.append(
        "email",
        form.registerEmail.value
    );

    data.append(
        "password",
        form.registerPassword.value
    );

    try {
        const response = await fetch("register.php", {
            method: "POST",
            body: data
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || "Account registration failed.");
        }
        showToast(result.message);
        document.querySelector('[data-auth-page="login"]').click();
        form.reset();
    } catch (error) {
        showToast(error.message || "Could not connect to the server.", "warning");
        console.error(error);
    }


			});
			byId("logout-button").addEventListener("click", async () => {
				try {
					const response = await fetch("logout.php", { method: "POST" });
					const result = await response.json();
					if (!response.ok || !result.success) {
						throw new Error(result.message || "Server sign-out failed.");
					}
				} catch (error) {
					console.error(error);
					showToast(`Could not confirm sign-out with the server: ${error.message}`, "warning");
				}
				sessionStorage.removeItem("bp-login-name");
				sessionStorage.removeItem("bp-login-role");
				sessionStorage.removeItem("bp-staff-name");
				cart = [];
				navigate("overview");
				byId("app-shell").hidden = true;
				byId("login-screen").hidden = false;
				document.querySelectorAll("[data-login-form]").forEach((form) => form.reset());
				loginRole = "staff";
				document.querySelector('[data-login-role="staff"]').click();
			});
			byId("notification-list").addEventListener("click", (event) => {
				if (!event.target.closest("[data-notification-material]")) return;
				byId("notification-panel").hidden = true;
				byId("notification-button").setAttribute("aria-expanded", "false");
				navigate("inventory");
				const material = state.materials.find((item) => item.id === event.target.closest("[data-notification-material]").dataset.notificationMaterial);
				if (material) {
					byId("inventory-search").value = material.name;
					renderInventory();
				}
			});

			function showToast(message, type = "notice") {
				const toast = byId("toast");
				toast.textContent = message;
				toast.classList.toggle("warning", type === "warning");
				toast.classList.add("show");
				clearTimeout(toastTimer);
				toastTimer = setTimeout(() => {
					toast.classList.remove("show", "warning");
				}, type === "warning" ? 8000 : 5000);
			}

			function showLowStockAlert(items) {
				if (!items.length) return;
				const names = items.slice(0, 3).map((item) => `${item.name} (${item.stock} ${item.unit} left)`);
				const remaining = items.length - names.length;
				showToast(`Low stock alert: ${names.join(", ")}${remaining > 0 ? `, and ${remaining} more` : ""}.`, "warning");
			}

			function navigate(view) {
				if (view === "archive" && sessionStorage.getItem("bp-login-role") !== "admin") return;
				document.querySelectorAll(".page").forEach((page) => page.classList.toggle("active", page.id === "page-" + view));
				document.querySelectorAll(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
				byId("current-section").textContent = {
					overview: "Dashboard", pos: "POS", inventory: "Inventory", sales: "Sales report",
					"stock-report": "Stock report",
					archive: "Archive", analytics: "Analytics"
				}[view];
				if (view === "pos") renderPos();
				if (view === "inventory") {
					renderInventory();
					renderMenuCatalog();
					renderRecipeEditor();
				}
				if (view === "sales") renderSales();
				if (view === "stock-report") renderStockReport();
				if (view === "archive") renderArchive();
				if (view === "analytics") renderAnalytics();
				if (view === "overview") renderOverview();
				window.scrollTo({ top: 0, behavior: "smooth" });
			}

			function renderOverview() {
				const low = lowItems();
				renderStockNotifications();
				const isAdmin = sessionStorage.getItem("bp-login-role") === "admin";
				const today = new Date().toDateString();
				const todaysSales = state.sales.filter((sale) => new Date(sale.createdAt).toDateString() === today);
				const revenue = todaysSales.reduce((sum, sale) => sum + sale.total, 0);
				const sold = todaysSales.reduce((sum, sale) => sum + saleUnits(sale), 0);
				const weekStart = new Date();
				weekStart.setDate(weekStart.getDate() - 6);
				weekStart.setHours(0, 0, 0, 0);
				const weeklySales = state.sales.filter((sale) => new Date(sale.createdAt) >= weekStart);
				const weeklyRevenue = weeklySales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
				const weeklyProducts = new Map();
				weeklySales.forEach((sale) => sale.items.forEach((item) => {
					const entry = weeklyProducts.get(item.name) || { name: item.name, quantity: 0 };
					entry.quantity += Number(item.quantity || 0);
					weeklyProducts.set(item.name, entry);
				}));
				const bestSellers = [...weeklyProducts.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
				const metrics = isAdmin
					? [
						["Today's revenue", money(revenue), `${todaysSales.length} completed ${todaysSales.length === 1 ? "order" : "orders"}`, "₱"],
						["7-day revenue", money(weeklyRevenue), "Across the last 7 days", "↗"],
						["Menu items", state.products.length.toLocaleString(), "Available in the till", "▤"],
						["Low stock", low.length.toLocaleString(), low.length ? "Needs a restock" : "Everything is looking good", "!"]
					]
					: [
						["Today's sales", money(revenue), "Shop total today", "₱"],
						["Orders today", todaysSales.length.toLocaleString(), "Completed transactions", "↗"],
						["Items sold", sold.toLocaleString(), "Across today's orders", "▤"],
						["Low stock", low.length.toLocaleString(), low.length ? "Let a manager know" : "Everything is looking good", "!"]
					];
				byId("overview-title").textContent = isAdmin ? "Admin dashboard" : "Staff dashboard";
				byId("overview-description").textContent = isAdmin
					? "Monitor revenue, best sellers, and stock levels across the shop."
					: "Take orders, keep service moving, and watch the stock that needs attention.";
				byId("overview-action").dataset.go = isAdmin ? "analytics" : "pos";
				byId("overview-action").innerHTML = isAdmin
					? `View analytics <span aria-hidden="true">→</span>`
					: `<span aria-hidden="true">＋</span> New sale`;
				byId("overview-left-title").textContent = isAdmin ? "Best sellers · last 7 days" : "Stock to watch";
				byId("overview-left-link").textContent = isAdmin ? "Full analytics →" : "View inventory →";
				byId("overview-left-link").dataset.go = isAdmin ? "analytics" : "inventory";
				byId("overview-right-title").textContent = isAdmin ? "Stock to watch" : "Recent sales";
				byId("overview-right-link").textContent = isAdmin ? "Manage inventory →" : "All sales →";
				byId("overview-right-link").dataset.go = isAdmin ? "inventory" : "sales";
				byId("overview-metrics").innerHTML = metrics
					.map(([label, value, note, icon]) => `<article class="metric"><div class="metric-label">${label}<span class="metric-icon">${icon}</span></div><div class="metric-value">${value}</div><div class="metric-note">${note}</div></article>`).join("");
				const stockMarkup = low.length
					? low.slice(0, 5).map((item) => `<div class="alert-row"><div><div class="item-name">${escapeHtml(item.name)}</div><div class="item-meta">Reorder at ${item.threshold} ${escapeHtml(item.unit)} · ${escapeHtml(item.category)}</div></div><span class="stock-pill">${item.stock} ${escapeHtml(item.unit)} left</span></div>`).join("")
					: `<div class="empty-state">All raw materials are above their reorder level.</div>`;
				const sellerMarkup = bestSellers.length
					? bestSellers.map((item, index) => {
						const width = (item.quantity / bestSellers[0].quantity) * 100;
						return `<div class="alert-row"><div><div class="item-name">${index + 1}. ${escapeHtml(item.name)}</div><div class="item-meta">Sold in the last 7 days</div></div><span class="stock-pill ok">${item.quantity} sold</span><span class="top-product-track" aria-hidden="true"><span style="width:${width}%"></span></span></div>`;
					}).join("")
					: `<div class="empty-state">Completed sales will show your best sellers here.</div>`;
				const recentSalesMarkup = state.sales.length
					? state.sales.slice(0, 5).map((sale) => `<div class="activity-row"><div><div class="activity-id">${escapeHtml(sale.id)}</div><div class="activity-time">${formatTime(sale.createdAt)} · ${saleUnits(sale)} items</div></div><div class="activity-total">${money(sale.total)}</div></div>`).join("")
					: `<div class="empty-state">Completed orders will show up here.</div>`;
				byId("overview-alerts").innerHTML = isAdmin ? sellerMarkup : stockMarkup;
				byId("overview-sales").innerHTML = isAdmin ? stockMarkup : recentSalesMarkup;
			}

			function renderPos() {
				const categories = ["All", ...new Set(state.products.map((item) => item.category))];
				if (!categories.includes(activeCategory)) activeCategory = "All";
				byId("category-tabs").innerHTML = categories.map((category) => `<button class="category-tab ${category === activeCategory ? "active" : ""}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("");
				const query = byId("pos-search").value.trim().toLowerCase();
				const visible = state.products.filter((item) => (activeCategory === "All" || item.category === activeCategory) && item.name.toLowerCase().includes(query));
				byId("product-grid").innerHTML = visible.length ? visible.map((item) => `<button class="product-card" data-product="${escapeHtml(item.id)}"><span class="product-glyph" aria-hidden="true">${escapeHtml(item.glyph || "◉")}</span><span class="product-info"><span><span class="product-name">${escapeHtml(item.name)}</span><span class="product-stock">${state.recipes[item.id]?.length ? "Recipe saved" : "No recipe"}</span></span><span class="product-price">${money(item.price)}</span></span></button>`).join("") : `<div class="empty-state">No menu items match that search.</div>`;
				renderCart();
			}

			function renderCart() {
				const count = cart.reduce((sum, line) => sum + line.quantity, 0);
				const subtotal = cart.reduce((sum, line) => sum + line.quantity * line.price, 0);
				byId("cart-count").textContent = count;
				byId("order-number").textContent = `Order ${String(state.sales.length + 1).padStart(3, "0")} · Not yet paid`;
				byId("cart-items").innerHTML = cart.length ? cart.map((line) => `<div class="cart-line"><div><div class="cart-product-name">${escapeHtml(line.name)}</div><div class="cart-product-price">${money(line.price)} each</div><div class="quantity-control"><button data-cart-action="minus" data-id="${escapeHtml(line.id)}" aria-label="Remove one ${escapeHtml(line.name)}">−</button><span>${line.quantity}</span><button data-cart-action="plus" data-id="${escapeHtml(line.id)}" aria-label="Add one ${escapeHtml(line.name)}">+</button></div></div><div class="cart-line-total">${money(line.price * line.quantity)}</div></div>`).join("") : `<div class="cart-empty">Your order is empty</div>`;
				byId("cart-bottom").innerHTML = `<div class="totals-row"><span>Subtotal</span><span>${money(subtotal)}</span></div><div class="totals-row"><span>Tax</span><span>Included</span></div><div class="totals-row total"><span>Total</span><span>${money(subtotal)}</span></div><button class="button" id="checkout-button" ${cart.length ? "" : "disabled"}>Take payment <span aria-hidden="true">→</span></button><p class="tax-note">Prices shown in Philippine pesos</p>`;
			}

			function renderInventory() {
				renderStockNotifications();
				const query = byId("inventory-search").value.trim().toLowerCase();
				const filter = byId("inventory-filter").value;
				const items = state.materials.filter((item) => {
					const isLow = !item.setupRequired && Number(item.stock) <= Number(item.threshold);
					return item.name.toLowerCase().includes(query) &&
						(filter === "all" || (filter === "low" ? isLow : !item.setupRequired && !isLow));
				});
				const low = lowItems();
				const openingStockCount = state.materials.filter((item) => item.setupRequired).length;
				byId("inventory-notice").innerHTML = low.length || openingStockCount
					? `<div class="notice"><span aria-hidden="true">!</span><span>${low.length ? `<strong>${low.length} ${low.length === 1 ? "material needs" : "materials need"} attention.</strong> ` : ""}${openingStockCount ? `${openingStockCount} materials need their opening quantities entered using Edit or Receive stock.` : "Stock at or below reorder level is highlighted below."}</span></div>`
					: "";
				const grouped = new Map();
				items.forEach((item) => {
					if (!grouped.has(item.category)) grouped.set(item.category, []);
					grouped.get(item.category).push(item);
				});
				const rows = [...grouped.entries()].map(([category, categoryItems]) => {
					const heading = `<tr class="inventory-category-row"><th colspan="6">${escapeHtml(category)}</th></tr>`;
					return heading + categoryItems.map((item) => {
						const lowStock =
!item.setupRequired &&
Number(item.stock) <= Number(item.threshold);

const outOfStock =
Number(item.stock) <= 0;

						const status = item.setupRequired ? "Opening stock needed" : lowStock ? "Low stock" : "In stock";
						const actions = sessionStorage.getItem("bp-login-role") === "admin"
							? `<button class="table-action" type="button" data-edit-material="${escapeHtml(item.id)}">Edit</button> <button class="table-action" type="button" data-restock-material="${escapeHtml(item.id)}">＋ Receive</button>`
							: `<button class="table-action" type="button" data-restock-material="${escapeHtml(item.id)}">＋ Receive</button>`;
						const supplier = item.supplier ? `<div class="item-meta">Supplier: ${escapeHtml(item.supplier)}</div>` : "";
						const brand = item.brand ? `<div class="item-meta">Brand: ${escapeHtml(item.brand)}</div>` : "";
						const groups = Array.isArray(item.groups) && item.groups.length
							? `<div class="item-meta">Use: ${item.groups.map(escapeHtml).join(", ")}</div>`
							: "";
						return `<tr><td><strong>${escapeHtml(item.name)}</strong>${groups}${supplier}${brand}</td><td>${escapeHtml(item.category)}</td><td>${Number(item.stock).toLocaleString()} ${escapeHtml(item.unit)}</td><td>${Number(item.threshold).toLocaleString()} ${escapeHtml(item.unit)}</td><td><span class="stock-pill ${lowStock || item.setupRequired ? "" : "ok"}">${status}</span></td><td>${actions}</td></tr>`;
					}).join("");
				}).join("");
				byId("inventory-rows").innerHTML = rows || `<tr><td colspan="6"><div class="empty-state">No raw materials match these filters.</div></td></tr>`;
			}

			function renderMenuCatalog() {
				if (!state || !byId("menu-product-rows")) return;
				byId("menu-product-rows").innerHTML = state.products.length
					? state.products.map((item) => `<tr><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.category)}</td><td>${money(item.price)}</td><td><button class="table-action" type="button" data-edit-menu-product="${escapeHtml(item.id)}">Edit</button> <button class="table-action" type="button" data-archive-menu-product="${escapeHtml(item.id)}">Archive</button></td></tr>`).join("")
					: `<tr><td colspan="4"><div class="empty-state">No menu items. Add one to start taking orders.</div></td></tr>`;
			}

			function renderRecipeEditor() {
				if (!state || !byId("recipe-product-select")) return;
				const select = byId("recipe-product-select");
				const currentSelection = selectedRecipeProductId || select.value;
				select.innerHTML = state.products.map((product) =>
					`<option value="${escapeHtml(product.id)}">${escapeHtml(product.name)}</option>`
				).join("");
				selectedRecipeProductId = state.products.some((product) => product.id === currentSelection)
					? currentSelection
					: state.products[0]?.id || "";
				select.value = selectedRecipeProductId;
				const configuredCount = Object.values(state.recipes).filter((recipe) => Array.isArray(recipe) && recipe.length).length;
				byId("recipe-guidance").textContent = `${configuredCount} of ${state.products.length} menu items have recipes. Recipes are optional references; orders do not change raw-material stock.`;
				const recipe = state.recipes[selectedRecipeProductId] || [];
				byId("recipe-rows").innerHTML = recipe.length
					? recipe.map((ingredient) => recipeRowMarkup(ingredient)).join("")
					: `<p class="recipe-empty">No ingredients added yet. Set the quantity used for one menu item.</p>`;
			}

			function recipeRowMarkup(ingredient = {}) {
				const materialOptions = state.materials.map((material) =>
					`<option value="${escapeHtml(material.id)}" ${material.id === ingredient.materialId ? "selected" : ""}>${escapeHtml(material.name)} · ${escapeHtml(material.unit)}</option>`
				).join("");
				return `<div class="recipe-row" data-recipe-row><label><span class="field-label">Raw material</span><select class="select-input" data-recipe-material required>${materialOptions}</select></label><label><span class="field-label">Quantity per item</span><input class="field-input" data-recipe-quantity type="number" min="0.000001" step="any" required value="${ingredient.quantity ? escapeHtml(ingredient.quantity) : ""}" placeholder="e.g. 0.025"></label><button class="table-action danger" type="button" data-remove-recipe-row aria-label="Remove ingredient">Remove</button></div>`;
			}

			function renderStockReport() {
				const low = lowItems();
				byId("stock-report-metrics").innerHTML = [
					["Raw materials", state.materials.length.toLocaleString(), "Tracked supplies and ingredients", "▤"],
					["Opening quantities needed", state.materials.filter((item) => item.setupRequired).length.toLocaleString(), "Set current stock for accurate inventory", "＋"],
					["Low-stock items", low.length.toLocaleString(), low.length ? "At or below reorder level" : "No restock needed", "!"],
					["Recipes configured", Object.values(state.recipes).filter((recipe) => Array.isArray(recipe) && recipe.length).length.toLocaleString(), "Menu items with saved ingredient recipes", "✓"]
				].map(([label, value, note, icon]) => `<article class="metric"><div class="metric-label">${label}<span class="metric-icon">${icon}</span></div><div class="metric-value">${value}</div><div class="metric-note">${note}</div></article>`).join("");
				byId("stock-report-rows").innerHTML = state.materials.length
					? state.materials.map((item) => {
						const outOfStock = !item.setupRequired && Number(item.stock) <= 0;
						const lowStock = !item.setupRequired && Number(item.stock) <= Number(item.threshold);
						const status = item.setupRequired ? "Opening stock needed" : outOfStock ? "Out of Stock" : lowStock ? "Low Stock" : "In Stock";
						return `<tr><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.category)}</td><td>${Number(item.stock).toLocaleString()} ${escapeHtml(item.unit)}</td><td>${Number(item.threshold).toLocaleString()} ${escapeHtml(item.unit)}</td><td><span class="stock-pill ${outOfStock || lowStock || item.setupRequired ? "" : "ok"}">${status}</span></td></tr>`;
					}).join("")
					: `<tr><td colspan="5"><div class="empty-state">No raw materials to report.</div></td></tr>`;
			}

			function renderArchive() {
				if (sessionStorage.getItem("bp-login-role") !== "admin") return;
				const archivedProducts = state.archivedProducts || [];
				byId("archive-summary").textContent = `${archivedProducts.length} archived ${archivedProducts.length === 1 ? "product" : "products"}`;
				byId("archive-rows").innerHTML = archivedProducts.length
					? archivedProducts.map((item) => `<tr><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.category)}</td><td>${money(item.price)}</td><td>${item.archivedAt ? formatDate(new Date(item.archivedAt)) : "Previously archived"}</td><td><button class="table-action" type="button" data-restore-product="${escapeHtml(item.id)}">Restore</button> <button class="table-action" type="button" data-delete-archived-product="${escapeHtml(item.id)}">Delete permanently</button></td></tr>`).join("")
					: `<tr><td colspan="5"><div class="empty-state">No archived products. Deleted products will appear here.</div></td></tr>`;
			}

			function renderSales() {
				const today = new Date().toDateString();
				const todaysSales = state.sales.filter((sale) => new Date(sale.createdAt).toDateString() === today);
				byId("sales-summary").innerHTML = `<strong>${todaysSales.length} today</strong><span>·</span><strong>${money(todaysSales.reduce((sum, sale) => sum + sale.total, 0))}</strong>`;
				byId("sales-rows").innerHTML = state.sales.length ? state.sales.map((sale) => `<tr><td><strong>${escapeHtml(sale.id)}</strong></td><td>${formatDate(new Date(sale.createdAt))} · ${formatTime(sale.createdAt)}</td><td>${sale.items.map((item) => `${item.quantity} × ${escapeHtml(item.name)}`).join(", ")}</td><td>${escapeHtml(sale.payment)}</td><td><strong>${money(sale.total)}</strong></td><td><button class="table-action" type="button" data-receipt="${escapeHtml(sale.id)}">View receipt</button></td></tr>`).join("") : `<tr><td colspan="6"><div class="empty-state">No sales yet. Your first completed order will appear here.</div></td></tr>`;
			}

			function renderAnalytics() {
				const period = byId("analytics-period").value;
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				const start = new Date(today);
				if (period !== "all") start.setDate(start.getDate() - Number(period) + 1);
				const filteredSales = state.sales.filter((sale) => {
					const date = new Date(sale.createdAt);
					return !Number.isNaN(date.getTime()) && (period === "all" || date >= start);
				});
				const revenue = filteredSales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
				const orders = filteredSales.length;
				const units = filteredSales.reduce((sum, sale) => sum + saleUnits(sale), 0);
				byId("analytics-metrics").innerHTML = [
					["Revenue", money(revenue), period === "all" ? "All recorded sales" : `Last ${period} days`, "₱"],
					["Orders", orders.toLocaleString(), "Completed transactions", "↗"],
					["Items sold", units.toLocaleString(), "Units in completed orders", "▤"],
					["Average order", money(orders ? revenue / orders : 0), "Revenue per transaction", "◎"]
				].map(([label, value, note, icon]) => `<article class="metric"><div class="metric-label">${label}<span class="metric-icon">${icon}</span></div><div class="metric-value">${value}</div><div class="metric-note">${note}</div></article>`).join("");

				const buckets = new Map();
				const bucketCount = period === "all" ? 12 : Number(period);
				for (let offset = bucketCount - 1; offset >= 0; offset -= 1) {
					const date = new Date(today);
					date.setDate(date.getDate() - offset);
					const key = period === "all"
						? `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`
						: date.toDateString();
					buckets.set(key, { date, total: 0 });
				}
				filteredSales.forEach((sale) => {
					const date = new Date(sale.createdAt);
					const key = period === "all"
						? `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`
						: new Date(date.getFullYear(), date.getMonth(), date.getDate()).toDateString();
					if (buckets.has(key)) buckets.get(key).total += Number(sale.total || 0);
				});
				const chartData = [...buckets.values()];
				const maxRevenue = Math.max(1, ...chartData.map((bucket) => bucket.total));
				const chartFormat = period === "all"
					? new Intl.DateTimeFormat("en", { month: "short", year: "2-digit" })
					: new Intl.DateTimeFormat("en", { weekday: "short" });
				byId("analytics-chart-caption").textContent = period === "all" ? "Monthly totals · last 12 months" : "Revenue by day";
				byId("analytics-chart").innerHTML = chartData.map(({ date, total }) => {
					const height = total ? Math.max(4, (total / maxRevenue) * 100) : 0;
					return `<div class="chart-column" aria-label="${escapeHtml(chartFormat.format(date))}: ${escapeHtml(money(total))}"><div class="chart-value">${total ? escapeHtml(money(total)) : ""}</div><div class="chart-track"><span class="chart-bar" style="height:${height}%"></span></div><div class="chart-label">${escapeHtml(chartFormat.format(date))}</div></div>`;
				}).join("");

				const productTotals = new Map();
				filteredSales.forEach((sale) => sale.items.forEach((item) => {
					const entry = productTotals.get(item.name) || { name: item.name, quantity: 0, revenue: 0 };
					entry.quantity += Number(item.quantity || 0);
					entry.revenue += Number(item.quantity || 0) * Number(item.price || 0);
					productTotals.set(item.name, entry);
				}));
				const bestSellers = [...productTotals.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
				const maxUnits = bestSellers.length ? bestSellers[0].quantity : 0;
				byId("analytics-products").innerHTML = bestSellers.length ? bestSellers.map((item, index) => {
					const width = maxUnits ? (item.quantity / maxUnits) * 100 : 0;
					return `<div class="top-product"><div class="top-product-heading"><strong><span class="top-product-rank">${index + 1}</span>${escapeHtml(item.name)}</strong><span>${item.quantity} sold</span></div><div class="top-product-track"><span style="width:${width}%"></span></div><div class="top-product-revenue">${money(item.revenue)} revenue</div></div>`;
				}).join("") : `<div class="empty-state">Completed sales will show your best sellers here.</div>`;
			}

			function showReceipt(sale) {
				byId("receipt-details").innerHTML = `<div><span>Receipt</span><strong>${escapeHtml(sale.id)}</strong></div><div><span>Date</span><strong>${formatDate(new Date(sale.createdAt))} · ${formatTime(sale.createdAt)}</strong></div><div><span>Cashier</span><strong>${escapeHtml(sale.cashier || "Staff")}</strong></div><div><span>Payment</span><strong>${escapeHtml(sale.payment)}</strong></div>`;
				byId("receipt-lines").innerHTML = sale.items.map((item) => `<div class="receipt-line"><span>${item.quantity} × ${escapeHtml(item.name)}<small>${money(item.price)} each</small></span><strong>${money(item.quantity * item.price)}</strong></div>`).join("");
				byId("receipt-total").innerHTML = `<div><span>Subtotal</span><strong>${money(sale.total)}</strong></div><div><span>Tax</span><strong>Included</strong></div><div class="receipt-grand-total"><span>Total</span><strong>${money(sale.total)}</strong></div>`;
				if (!byId("receipt-dialog").open) byId("receipt-dialog").showModal();
			}
function canMakeProduct(productId, quantity = 1) {
    const recipe = state.recipes[productId];

    if (!recipe || !recipe.length) return true;

    for (const ingredient of recipe) {
        const material = state.materials.find(
            m => m.id === ingredient.materialId
        );

        if (!material) continue;

        const needed =
            Number(ingredient.quantity) * quantity;

        if (Number(material.stock) < needed) {
            return false;
        }
    }

    return true;
}
function deductRecipeStock(productId, quantitySold) {

    const recipe = state.recipes[productId];

    if (!recipe || !recipe.length) return;

    recipe.forEach(ingredient => {

        const material = state.materials.find(
            item => item.id === ingredient.materialId
        );

        if (!material) return;

        material.stock =
            Number(material.stock) -
            (Number(ingredient.quantity) * quantitySold);

        if (material.stock < 0) {
            material.stock = 0;
        }

        material.setupRequired = false;
    });
}

function addToCart(id) {

    if (!canMakeProduct(id, 1)) {

        showToast(
            "Cannot add item. Insufficient ingredients.",
            "warning"
        );

        return;
    }

    const product =
        state.products.find(
            item => item.id === id
        );

    const line =
        cart.find(
            item => item.id === id
        );

    if (!product) return;

    if (line) {

        if (!canMakeProduct(id, line.quantity + 1)) {

            showToast(
                "Not enough ingredients available.",
                "warning"
            );

            return;
        }

        line.quantity++;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    renderPos();
}


			byId("main-navigation").addEventListener("click", (event) => {
				const button = event.target.closest(".nav-button");
				if (button) navigate(button.dataset.view);
			});
			document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.go)));
			byId("pos-search").addEventListener("input", renderPos);
			byId("analytics-period").addEventListener("change", renderAnalytics);
			byId("category-tabs").addEventListener("click", (event) => {
				const button = event.target.closest("[data-category]");
				if (button) { activeCategory = button.dataset.category; renderPos(); }
			});
			byId("product-grid").addEventListener("click", (event) => {
				const button = event.target.closest("[data-product]");
				if (button) addToCart(button.dataset.product);
			});
			byId("cart-items").addEventListener("click", (event) => {
				const button = event.target.closest("[data-cart-action]");
				if (!button) return;
				const line = cart.find((item) => item.id === button.dataset.id);
				if (!line) return;
				if (button.dataset.cartAction === "plus") {
					const nextCart = cart.map((cartLine) => cartLine.id === line.id ? { ...cartLine, quantity: cartLine.quantity + 1 } : cartLine);
					cart = nextCart;
				} else line.quantity -= 1;
				cart = cart.filter((item) => item.quantity > 0);
				renderPos();
			});
			byId("recipe-product-select").addEventListener("change", (event) => {
				selectedRecipeProductId = event.currentTarget.value;
				renderRecipeEditor();
			});
			byId("add-recipe-ingredient").addEventListener("click", () => {
				if (!state.materials.length) return showToast("Add a raw material before creating recipes.", "warning");
				if (!byId("recipe-rows").querySelector("[data-recipe-row]")) byId("recipe-rows").innerHTML = "";
				byId("recipe-rows").insertAdjacentHTML("beforeend", recipeRowMarkup());
			});
			byId("recipe-rows").addEventListener("click", (event) => {
				const button = event.target.closest("[data-remove-recipe-row]");
				if (!button) return;
				button.closest("[data-recipe-row]").remove();
				if (!byId("recipe-rows").querySelector("[data-recipe-row]")) {
					byId("recipe-rows").innerHTML = `<p class="recipe-empty">No ingredients added yet. Set the quantity used for one menu item.</p>`;
				}
			});
			byId("save-recipe-button").addEventListener("click", async (event) => {
				if (sessionStorage.getItem("bp-login-role") !== "admin") return;
				if (!selectedRecipeProductId) return showToast("Choose a menu item first.", "warning");
				const rows = [...byId("recipe-rows").querySelectorAll("[data-recipe-row]")];
				const recipe = rows.map((row) => ({
					materialId: row.querySelector("[data-recipe-material]").value,
					quantity: Number(row.querySelector("[data-recipe-quantity]").value)
				}));
				if (!recipe.length) return showToast("Add at least one ingredient to save this recipe.", "warning");
				if (rows.some((row) => !row.querySelector("[data-recipe-material]").reportValidity() || !row.querySelector("[data-recipe-quantity]").reportValidity())) return;
				if (recipe.some((ingredient) => !Number.isFinite(ingredient.quantity) || ingredient.quantity <= 0)) return showToast("Ingredient quantities must be greater than zero.", "warning");
				if (new Set(recipe.map((ingredient) => ingredient.materialId)).size !== recipe.length) return showToast("Each raw material can only appear once in a recipe.", "warning");
				const productId = selectedRecipeProductId;
				const saveButton = event.currentTarget;
				saveButton.disabled = true;
				saveButton.textContent = "Saving…";
				try {
					let saved = false;
					for (let attempt = 0; attempt < 3 && !saved; attempt += 1) {
						state.recipes[productId] = recipe;
						saved = await persist();
					}
					if (!saved) {
						showToast("Recipe was not saved. Check the database connection and try again.", "warning");
						return;
					}
					renderRecipeEditor();
					renderPos();
					renderStockReport();
					showToast(`${state.products.find((item) => item.id === productId)?.name || "Menu item"} recipe saved`);
				} finally {
					saveButton.disabled = false;
					saveButton.textContent = "Save recipe";
				}
			});
			byId("cart-bottom").addEventListener("click", (event) => {
				if (event.target.closest("#checkout-button") && cart.length) {
					const total = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
					byId("checkout-total").textContent = money(total);
					byId("checkout-dialog").showModal();
				}
			});
			byId("checkout-form").addEventListener("submit", async (event) => {
				event.preventDefault();
				if (!cart.length) return;
				const total = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
				const sale = {
					id: `BP-${String(Date.now()).slice(-6)}`,
					createdAt: new Date().toISOString(),
					items: cart.map((line) => ({ ...line })),
					total,
					payment: new FormData(event.currentTarget).get("payment"),
					cashier: sessionStorage.getItem("bp-login-name") || "Staff"
				};
				cart.forEach(cartItem => {

    deductRecipeStock(
        cartItem.id,
        cartItem.quantity
    );

});

				state.sales.unshift(sale);
				await persist();
				cart = [];
				byId("checkout-dialog").close();
				renderPos();
				renderInventory();
				renderOverview();
				renderSales();
				renderAnalytics();
				renderStockReport();
				showReceipt(sale);
			});
			byId("sales-rows").addEventListener("click", (event) => {
				const button = event.target.closest("[data-receipt]");
				if (!button) return;
				const sale = state.sales.find((item) => item.id === button.dataset.receipt);
				if (sale) showReceipt(sale);
			});
			byId("print-receipt-button").addEventListener("click", () => window.print());
			byId("inventory-search").addEventListener("input", renderInventory);
			byId("inventory-filter").addEventListener("change", renderInventory);
			byId("menu-product-rows").addEventListener("click", (event) => {
				if (sessionStorage.getItem("bp-login-role") !== "admin") return;
				const editButton = event.target.closest("[data-edit-menu-product]");
				if (editButton) {
					const product = state.products.find((item) => item.id === editButton.dataset.editMenuProduct);
					if (!product) return;
					editingProductId = product.id;
					byId("item-dialog-title").textContent = "Edit menu item";
					byId("item-save-button").textContent = "Save changes";
					byId("item-form").elements.name.value = product.name;
					byId("item-form").elements.category.value = product.category;
					byId("item-form").elements.price.value = product.price;
					byId("item-dialog").showModal();
					return;
				}
				const archiveButton = event.target.closest("[data-archive-menu-product]");
				if (!archiveButton) return;
				const product = state.products.find((item) => item.id === archiveButton.dataset.archiveMenuProduct);
				if (!product) return;
				pendingDeleteProductId = product.id;
				pendingDeleteFromArchive = false;
				byId("delete-confirm-title").textContent = "Move menu item to archive?";
				byId("confirm-delete-button").textContent = "Move to archive";
				byId("delete-confirm-message").textContent = `Move "${product.name}" to the archive? You can restore it later.`;
				byId("delete-confirm-dialog").showModal();
			});
			byId("add-product-button").addEventListener("click", () => {
				if (sessionStorage.getItem("bp-login-role") !== "admin") return;
				editingProductId = null;
				byId("item-form").reset();
				byId("item-dialog-title").textContent = "Add menu item";
				byId("item-save-button").textContent = "Save item";
				byId("item-dialog").showModal();
			});
			byId("item-form").addEventListener("submit", (event) => {
				event.preventDefault();
				if (sessionStorage.getItem("bp-login-role") !== "admin") return;
				const formData = new FormData(event.currentTarget);
				const name = String(formData.get("name")).trim();
				if (state.products.some((item) => item.id !== editingProductId && item.name.toLowerCase() === name.toLowerCase())) {
					return showToast("A menu item with that name already exists.", "warning");
				}
				const values = { name, category: String(formData.get("category")), price: Number(formData.get("price")) };
				const isUpdate = Boolean(editingProductId);
				let product;
				if (isUpdate) {
					product = state.products.find((item) => item.id === editingProductId);
					if (!product) return showToast("This menu item is no longer available.", "warning");
					Object.assign(product, values);
					cart.forEach((line) => {
						if (line.id === product.id) Object.assign(line, { name: product.name, price: product.price });
					});
				} else {
					product = { id: `item-${Date.now()}`, ...values, glyph: "◉" };
					state.products.push(product);
				}
				persist();
				editingProductId = null;
				event.currentTarget.reset();
				byId("item-dialog").close();
				renderMenuCatalog();
				renderRecipeEditor();
				renderPos();
				showToast(`${name} ${isUpdate ? "updated in" : "added to"} the menu.`);
			});
			byId("inventory-rows").addEventListener("click", (event) => {
				const editButton = event.target.closest("[data-edit-material]");
				if (editButton) {
					if (sessionStorage.getItem("bp-login-role") !== "admin") return;
					const material = state.materials.find((item) => item.id === editButton.dataset.editMaterial);
					if (!material) return;
					editingMaterialId = material.id;
					byId("material-dialog-title").textContent = "Edit raw material";
					byId("material-save-button").textContent = "Save changes";
					const form = byId("material-form");
					form.elements.name.value = material.name;
					form.elements.category.value = material.category;
					form.elements.supplier.value = material.supplier || "";
					form.elements.brand.value = material.brand || "";
					form.elements.unit.value = material.unit;
					form.elements.stock.value = material.stock;
					form.elements.threshold.value = material.threshold;
					form.elements.expiresOn.value = material.expiresOn || "";
					byId("material-dialog").showModal();
					return;
				}
				const button = event.target.closest("[data-restock-material]");
				if (!button) return;
				restockId = button.dataset.restockMaterial;
				const material = state.materials.find((item) => item.id === restockId);
				if (!material) return;
				byId("restock-item-name").textContent = `${material.name} · currently ${material.stock} ${material.unit} on hand`;
				byId("restock-dialog").showModal();
			});
			byId("restock-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const quantity = Number(
        new FormData(event.currentTarget)
        .get("quantity")
    );

    const material = state.materials.find(
        (item) => item.id === restockId
    );

    if (
        material &&
        Number.isFinite(quantity) &&
        quantity > 0
    ) {

        material.stock =
            Number(material.stock) +
            quantity;

        material.setupRequired = false;

        persist();

        renderInventory();
        renderOverview();
        renderStockReport();

        byId("restock-dialog").close();

        showToast(
            `${material.name} stock updated.`
        );
    }
});
			byId("add-material-button").addEventListener("click", () => {
				if (sessionStorage.getItem("bp-login-role") !== "admin") return;
				editingMaterialId = null;
				byId("material-form").reset();
				byId("material-form").elements.stock.value = 0;
				byId("material-form").elements.threshold.value = 0;
				byId("material-dialog-title").textContent = "Add raw material";
				byId("material-save-button").textContent = "Save material";
				byId("material-dialog").showModal();
			});
			byId("material-form").addEventListener("submit", (event) => {
				event.preventDefault();
				if (sessionStorage.getItem("bp-login-role") !== "admin") return;
				const formData = new FormData(event.currentTarget);
				const name = String(formData.get("name")).trim();
				const category = String(formData.get("category"));
				if (state.materials.some((item) => item.id !== editingMaterialId && item.category === category && item.name.toLowerCase() === name.toLowerCase())) {
					return showToast("A raw material with that name already exists in this category.", "warning");
				}
				const values = {
					name,
					category,
					supplier: String(formData.get("supplier") || "").trim(),
					brand: String(formData.get("brand") || "").trim(),
					unit: String(formData.get("unit")).trim(),
					stock: Number(formData.get("stock")),
					threshold: Number(formData.get("threshold")),
					expiresOn: String(formData.get("expiresOn") || ""),
					setupRequired: false
				};
				const isUpdate = Boolean(editingMaterialId);
				let material;
				if (isUpdate) {
					material = state.materials.find((item) => item.id === editingMaterialId);
					if (!material) return showToast("This raw material is no longer in inventory.", "warning");
					Object.assign(material, values);
				} else {
					material = { id: `material-${Date.now()}`, ...values };
					state.materials.push(material);
				}
				persist();
				editingMaterialId = null;
				event.currentTarget.reset();
				byId("material-dialog").close();
				renderInventory();
				renderRecipeEditor();
				renderOverview();
				renderStockReport();
				renderPos();
				showToast(`${name} ${isUpdate ? "updated" : "added"} in raw material inventory.`);
			});
			byId("confirm-delete-button").addEventListener("click", () => {
				if (sessionStorage.getItem("bp-login-role") !== "admin" || !pendingDeleteProductId) return;
				if (pendingDeleteFromArchive) {
					const archivedIndex = state.archivedProducts.findIndex((item) => item.id === pendingDeleteProductId);
					if (archivedIndex < 0) {
						byId("delete-confirm-dialog").close();
						return showToast("This archived item could not be found.", "warning");
					}
					const [product] = state.archivedProducts.splice(archivedIndex, 1);
					persist();
					renderArchive();
					byId("delete-confirm-dialog").close();
					return showToast(`${product.name} permanently deleted.`);
				}
				const product = state.products.find((item) => item.id === pendingDeleteProductId);
				if (!product) {
					byId("delete-confirm-dialog").close();
					return showToast("This item is no longer in inventory.", "warning");
				}
				state.products = state.products.filter((item) => item.id !== product.id);
				state.archivedProducts = state.archivedProducts || [];
				state.archivedProducts.unshift({ ...product, recipe: state.recipes[product.id] || [], archivedAt: new Date().toISOString() });
				delete state.recipes[product.id];
				cart = cart.filter((line) => line.id !== product.id);
				persist();
				renderInventory();
				renderMenuCatalog();
				renderRecipeEditor();
				renderOverview();
				renderPos();
				renderStockReport();
				renderArchive();
				byId("delete-confirm-dialog").close();
				showToast(`${product.name} moved to the archive.`);
			});
			byId("archive-rows").addEventListener("click", (event) => {
				const deleteButton = event.target.closest("[data-delete-archived-product]");
				if (deleteButton && sessionStorage.getItem("bp-login-role") === "admin") {
					const product = state.archivedProducts.find((item) => item.id === deleteButton.dataset.deleteArchivedProduct);
					if (!product) return;
					pendingDeleteProductId = product.id;
					pendingDeleteFromArchive = true;
					byId("delete-confirm-title").textContent = "Permanently delete product?";
					byId("confirm-delete-button").textContent = "Delete permanently";
					byId("delete-confirm-message").textContent = `Permanently delete "${product.name}"? This cannot be undone.`;
					byId("delete-confirm-dialog").showModal();
					return;
				}
				const button = event.target.closest("[data-restore-product]");
				if (!button || sessionStorage.getItem("bp-login-role") !== "admin") return;
				const archivedIndex = state.archivedProducts.findIndex((item) => item.id === button.dataset.restoreProduct);
				if (archivedIndex < 0) return;
				const [archivedProduct] = state.archivedProducts.splice(archivedIndex, 1);
				if (state.products.some((item) => item.id === archivedProduct.id || item.name.toLowerCase() === archivedProduct.name.toLowerCase())) {
					state.archivedProducts.splice(archivedIndex, 0, archivedProduct);
					return showToast("A product with that name or ID is already in inventory.", "warning");
				}
				const { archivedAt, recipe, ...product } = archivedProduct;
				state.products.push(product);
				if (Array.isArray(recipe) && recipe.length) state.recipes[product.id] = recipe;
				persist();
				renderArchive();
				renderInventory();
				renderMenuCatalog();
				renderRecipeEditor();
				renderOverview();
				renderPos();
				renderStockReport();
				showToast(`${product.name} restored to inventory.`);
			});
			document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => {
				if (button.closest("dialog").id === "item-dialog") {
					editingProductId = null;
					byId("item-form").reset();
				}
				if (button.closest("dialog").id === "material-dialog") {
					editingMaterialId = null;
					byId("material-form").reset();
				}
				button.closest("dialog").close();
			}));
			byId("delete-confirm-dialog").addEventListener("close", () => {
				pendingDeleteProductId = null;
				pendingDeleteFromArchive = false;
			});
			["item-dialog", "material-dialog", "restock-dialog", "delete-confirm-dialog", "checkout-dialog"].forEach((id) => byId(id).addEventListener("click", (event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }));

			renderOverview();
			renderPos();
			renderInventory();
			renderSales();
		})()