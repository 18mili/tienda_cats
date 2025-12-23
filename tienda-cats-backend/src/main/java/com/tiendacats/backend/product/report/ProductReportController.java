package com.tiendacats.backend.product.report;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports/products")
@CrossOrigin(
        origins = {"http://localhost:5173", "http://localhost:5174"},
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.OPTIONS}
)
public class ProductReportController {

    private final ProductReportRepository repo;

    public ProductReportController(ProductReportRepository repo) {
        this.repo = repo;
    }

    // ✅ Reporte 1: productos por categoría
    @GetMapping("/by-category")
    public List<Map<String, Object>> byCategory() {
        return repo.countByCategory();
    }

    // ✅ Reporte 2: productos destacados vs no destacados
    @GetMapping("/by-featured")
    public List<Map<String, Object>> byFeatured() {
        return repo.countByFeatured();
    }

    // ✅ Reporte 3: stock bajo (por ejemplo <= 5)
    @GetMapping("/low-stock")
    public List<Map<String, Object>> lowStock(@RequestParam(defaultValue = "5") int max) {
        return repo.lowStock(max);
    }
}
