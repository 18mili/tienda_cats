package com.tiendacats.backend.product.report;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class ProductReportRepository {

    private final JdbcTemplate jdbc;

    public ProductReportRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // Reporte 1: cantidad de productos por categoría
    public List<Map<String, Object>> countByCategory() {
        String sql = """
            SELECT category, COUNT(*) AS total
            FROM products
            WHERE deleted = false
            GROUP BY category
            ORDER BY total DESC
        """;
        return jdbc.queryForList(sql);
    }

    // Reporte 2: destacados vs no destacados
    public List<Map<String, Object>> countByFeatured() {
        String sql = """
            SELECT featured, COUNT(*) AS total
            FROM products
            WHERE deleted = false
            GROUP BY featured
            ORDER BY featured DESC
        """;
        return jdbc.queryForList(sql);
    }

    // Reporte 3: stock bajo
    public List<Map<String, Object>> lowStock(int max) {
        String sql = """
            SELECT id, name, stock
            FROM products
            WHERE deleted = false
              AND stock IS NOT NULL
              AND stock <= ?
            ORDER BY stock ASC
        """;
        return jdbc.queryForList(sql, max);
    }
}
