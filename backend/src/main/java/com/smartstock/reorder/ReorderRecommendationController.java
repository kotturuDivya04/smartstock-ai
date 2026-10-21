package com.smartstock.reorder;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reorders")
public class ReorderRecommendationController {

    private final ReorderRecommendationService reorderService;

    public ReorderRecommendationController(ReorderRecommendationService reorderService) {
        this.reorderService = reorderService;
    }

    @PostMapping("/generate")
    public ResponseEntity<Void> generateRecommendations() {
        reorderService.generateAllRecommendations();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<ReorderRecommendationResponse>> getAllRecommendations() {
        return ResponseEntity.ok(reorderService.getAllRecommendations());
    }

    @GetMapping("/recommendations/{productId}")
    public ResponseEntity<ReorderRecommendationResponse> getRecommendationByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(reorderService.getRecommendationByProductId(productId));
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ReorderRecommendationResponse> acceptRecommendation(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(reorderService.acceptRecommendation(id, principal.getName()));
    }

    @PostMapping("/{id}/modify")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ReorderRecommendationResponse> modifyRecommendation(@PathVariable Long id, @RequestParam Integer newQuantity, Principal principal) {
        return ResponseEntity.ok(reorderService.modifyRecommendation(id, newQuantity, principal.getName()));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ReorderRecommendationResponse> rejectRecommendation(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(reorderService.rejectRecommendation(id, principal.getName()));
    }

    /** Safely deletes only PENDING recommendations older than 1 day (old dummy seeded data). Never deletes APPROVED/REJECTED decisions. */
    @DeleteMapping("/stale")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteStaleRecommendations() {
        reorderService.deleteStaleRecommendations();
        return ResponseEntity.noContent().build();
    }
}

