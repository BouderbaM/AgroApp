const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
    padding: 15,
  },

  /* HEADER */
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 15,
  },

  /* KPI */
  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  kpi: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  kpiValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  kpiLabel: {
    color: "#94a3b8",
    fontSize: 11,
  },

  /* SEARCH */
  search: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 12,
    color: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  /* FILTER */
  filterRow: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  filterBtn: {
    color: "#94a3b8",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#111827",
    overflow: "hidden",
  },
  filterActive: {
    color: "#4CAF50",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },

  /* CARD */
  card: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  qty: {
    color: "#fff",
    fontWeight: "bold",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold",
  },
  name: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  sub: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: {
    color: "#94a3b8",
    fontSize: 11,
  },
  priceBox: {
    marginTop: 10,
    backgroundColor: "#0b1220",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  price: {
    color: "#4CAF50",
    fontWeight: "bold",
  },

  /* EMPTY */
  empty: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#64748b",
    marginTop: 10,
  },

  /* NAV */
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#0b1220",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
  },
});