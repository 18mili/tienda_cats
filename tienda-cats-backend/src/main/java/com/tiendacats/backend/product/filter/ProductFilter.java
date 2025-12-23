package com.tiendacats.backend.product.filter;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductFilter {
    private String categoria;     // ejemplo: "alimento", "juguete", "accesorio"
    private String nombre;        // búsqueda por nombre (like)
    private Integer minPrecio;    // mínimo
    private Integer maxPrecio;    // máximo
}
